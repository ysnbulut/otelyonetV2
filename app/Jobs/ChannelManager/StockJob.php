<?php

namespace App\Jobs\ChannelManager;

use App\Helpers\ChannelManagers;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\CMRoom;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class StockJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $backoff = 300;

    public function __construct(protected BookingRoom $bookingRooms)
    {
    }

    /**
     * @throws GuzzleException
     */
    public function handle(): void
    {
        $hotelSettings = new HotelSettings();
        $CMRoom = CMRoom::where('type_has_view_id', $this->bookingRooms->room->typeHasView->id)->first();
        if ($CMRoom !== null) {
            $CMStockDiff = $this->bookingRooms->room->typeHasView->rooms->count() - $CMRoom->stock;
            $dates = [];
            $diffDays = (Carbon::parse($this->bookingRooms->check_in)->endOfDay()->diffInDays(Carbon::parse
            ($this->bookingRooms->check_out)->endOfDay()));
            for ($i = 0; $i < $diffDays; $i++) {
                $check_in_date = Carbon::parse($this->bookingRooms->check_in)->addDays($i)->format('Y-m-d H:i:s');
                $check_out_date = Carbon::parse($this->bookingRooms->check_in)->subHours(3)->addDays(($i + 1))->format('Y-m-d H:i:s');
                $unavailableRoomsIds = Booking::getUnavailableRoomsIds($check_in_date,
                    $check_out_date);
                $unavailableRIDSDiff = array_intersect($unavailableRoomsIds, $this->bookingRooms->room->typeHasView->rooms->pluck('id')->toArray());
                $availableStock = collect(array_diff($this->bookingRooms->room->typeHasView->rooms->pluck('id')->toArray(),
                    $unavailableRIDSDiff))->flatten()->count();
                $dates[] = [
                    'date' => Carbon::parse($check_in_date)->format('Y-m-d'),
                    'availability' => max($availableStock - $CMStockDiff, 0)
                ];
            }
            $channelManager = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' =>
                $hotelSettings->api_settings['token'],
                'hr_id' => $hotelSettings->api_settings['hr_id']]);
            $updateResponse = $channelManager->updateDailyRoomStock($CMRoom->room_code, $dates);
            $this->bookingRooms->cmTransaction()->create([
                'id' => $updateResponse['transaction_id'],
                'status' => $updateResponse['status'],
                'errors' => $updateResponse['errors']
            ]);
        }
    }
}
