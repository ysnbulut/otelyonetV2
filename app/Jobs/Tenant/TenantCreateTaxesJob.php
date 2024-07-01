<?php

namespace App\Jobs\Tenant;

use App\Models\Tax;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TenantCreateTaxesJob implements ShouldQueue, ShouldBeUnique
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
            Tax::create(['name' => 'KDV %20', 'description' => 'Vergi', 'rate' => 20]);
            Tax::create(['name' => 'KDV %10', 'description' => 'Vergi', 'rate' => 10]);
            Tax::create(['name' => 'KDV %8', 'description' => 'Vergi', 'rate' => 8]);
            Tax::create(['name' => 'KDV %1', 'description' => 'Vergi', 'rate' => 1]);
        });
    }
}
