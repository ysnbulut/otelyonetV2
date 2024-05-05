<?php

namespace App\Jobs\Tenant;

use App\Models\Bank;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TenantCreateBanksJob implements ShouldQueue, ShouldBeUnique
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
        $this->tenant->run(function () {
            Bank::create(['name' => 'Nakit Kasa', 'currency' => 'TRY', 'type' => 'case']);
            Bank::create(['name' => 'POS Kasa', 'currency' => 'TRY', 'type' => 'bank']);
            Bank::create(['name' => 'Havale Kasa', 'currency' => 'TRY', 'type' => 'bank']);
            Bank::create(['name' => 'Online Kasa', 'currency' => 'TRY', 'type' => 'case']);
        });
    }
}
