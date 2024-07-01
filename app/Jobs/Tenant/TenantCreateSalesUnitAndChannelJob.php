<?php

namespace App\Jobs\Tenant;

use App\Models\SalesUnit;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TenantCreateSalesUnitAndChannelJob implements ShouldQueue, ShouldBeUnique
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
            $salesUnit = SalesUnit::create(['name' => 'Resepsiyon', 'description' => 'Resepsiyon Ünitesi']);
            $salesUnit->channels()->create(['name' => 'Konaklayan Misafir', 'description' => 'Konaklayan Misafirler Fiyatlandırması']);
        });
    }
}
