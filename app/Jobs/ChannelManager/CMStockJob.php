<?php

namespace App\Jobs\ChannelManager;

use App\Helpers\ChannelManagers;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\CMRoom;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CMStockJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public BookingRoom $bookingRooms;

    public int $uniqueFor = 900;


    public function uniqueId(): string
    {
        return $this->bookingRooms->id . '-' . $this->bookingRooms->booking->check_in . '-' .
            $this->bookingRooms->booking->check_out;
    }
    public function __construct(BookingRoom $bookingRooms)
    {
        $this->bookingRooms = $bookingRooms;
    }

    public function handle(): void
    {
        $hotelSettings = new HotelSettings();
        $cmRoom = CMRoom::where('type_has_view_id', $this->bookingRooms->room->typeHasView->id)->first();
        $diff = $this->bookingRooms->room->typeHasView->rooms->count() - $cmRoom->stock;
        $dates = [];
        $diffDays = (Carbon::parse($this->bookingRooms->booking->check_in)->diffInDays(Carbon::parse
            ($this->bookingRooms->booking->check_out))); //+1
        $stok = 0;
        for ($i = 0; $i < $diffDays; $i++) {
            $check_in_date = Carbon::parse($this->bookingRooms->booking->check_in)->addDays($i)->format('Y-m-d');
            $check_out_date = Carbon::parse($this->bookingRooms->booking->check_in)->addDays(($i + 1))->format('Y-m-d');
            $unavailableRoomsIds = Booking::getUnavailableRoomsIds($check_in_date, $check_out_date);
            $roomResults = $this->bookingRooms->room->typeHasView->with([
                'rooms' => function ($query) use ($unavailableRoomsIds) {
                    $query->whereNotIn('id', $unavailableRoomsIds);
                }
            ])
                ->whereHas('rooms', function ($query) use ($unavailableRoomsIds) {
                    $query->whereNotIn('id', $unavailableRoomsIds);
                })->get();
            $stok = $roomResults[0]->rooms->count();
            $dates[] =[
                'date' => $check_in_date,
                'availability' => $stok
            ];
        }

        if($diff > 0) {
            if($stok + 1 > $diff) {
                $cm = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' => $hotelSettings->api_settings['token'],
                    'hr_id' => $hotelSettings->api_settings['hr_id']]);
                $log = $cm->updateDailyRoomStock($cmRoom->room_code, $dates);
                Log::log('loggggg', 'Stock updated', json_encode($log));
            }
        } else {
            $cm = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' =>
                $hotelSettings->api_settings['token'],
                'hr_id' => $hotelSettings->api_settings['hr_id']]);
            $log = $cm->updateDailyRoomStock($cmRoom->room_code, $dates);
            Log::log('loggggg', 'Stock updated', json_encode($log));
        }
    }
}
