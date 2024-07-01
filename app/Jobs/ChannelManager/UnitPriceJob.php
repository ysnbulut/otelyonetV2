<?php

namespace App\Jobs\ChannelManager;

use App\Helpers\ChannelManagers;
use App\Models\CMRoom;
use App\Models\UnitPrice;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use JsonException;

class UnitPriceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $backoff = 15;

    public function __construct(protected UnitPrice $unitPrice, protected string $start_date, protected string $end_date, protected float $unit_price)
    {
        $this->start_date = Carbon::parse($start_date) < Carbon::now() ? Carbon::now()->format('Y-m-d') : $start_date;
    }

    /**
     * @throws GuzzleException
     * @throws JsonException
     */
    public function handle(): void
    {
        if ($this->end_date !== null && Carbon::parse($this->end_date) > Carbon::now()->startOfDay()) {
            $hotelSettings = new HotelSettings();
            $channelManager = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' => $hotelSettings->api_settings['token'],
                'hr_id' => $hotelSettings->api_settings['hr_id']]);
            $cmRoom = CMRoom::where('type_has_view_id', $this->unitPrice->type_has_view_id)->first();
            if ($cmRoom === null) {
                Log::error('CMRoom not found for unit price id: ' . $this->unitPrice->id);
            } else {
                $channelManager->updateRoomDateRange($cmRoom->room_code, $this->start_date, $this->end_date, $this->unit_price, (string)$this->unitPrice->channel->code);
            }
        }
    }
}
