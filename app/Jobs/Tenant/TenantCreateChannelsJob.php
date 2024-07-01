<?php

namespace App\Jobs\Tenant;

use App\Models\BookingChannel;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use JsonException;

class TenantCreateChannelsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public Tenant $tenant;

    public int $uniqueFor = 900;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function uniqueId(): string
    {
        return $this->tenant->id;
    }

    public function handle(): void
    {
        $this->tenant->run(/**
         * @throws JsonException
         */ function () {
            $channels = json_decode(file_get_contents(base_path('database/data/bookingChannels.json')), true, 512, JSON_THROW_ON_ERROR);
            BookingChannel::insert($channels);
        });
    }
}
