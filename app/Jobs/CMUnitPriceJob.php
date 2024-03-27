<?php

namespace App\Jobs;

use App\Helpers\ChannelManagers;
use App\Models\CMRoom;
use App\Models\UnitPrice;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CMUnitPriceJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public UnitPrice $unitPrice;

    public int $uniqueFor = 900;


    public function uniqueId(): string
    {
        return $this->unitPrice->id . '-' . $this->unitPrice->season->end_date . '-' . $this->unitPrice->season->start_date;
    }

    public function __construct(UnitPrice $unitPrice)
    {
        $this->unitPrice = $unitPrice;
    }

    public function handle(): void
    {
        if ($this->unitPrice->season->end_date !== null && Carbon::parse($this->unitPrice->season->end_date) > Carbon::now()
                ->startOfDay()) {
            $start_date = $this->unitPrice->season->start_date;
            if (Carbon::parse($this->unitPrice->season->start_date) < Carbon::now()) {
                $start_date = Carbon::now()->format('Y-m-d');
            }
            $hotelSettings = new HotelSettings();
            $cm = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' => $hotelSettings->api_settings['token'],
                'hr_id' => $hotelSettings->api_settings['hr_id']]);
            $cmRoom = CMRoom::where('type_has_view_id', $this->unitPrice->type_has_view_id)->first();
            if($cmRoom === null) {
                Log::error('CMRoom not found for unit price id: ' . $this->unitPrice->id);
            } else {
                $cm->updateRoomDateRange('HR:'.$cmRoom->room_code, $start_date, $this->unitPrice->season->end_date,
                    $this->unitPrice->unit_price);
            }

        }
    }
}
