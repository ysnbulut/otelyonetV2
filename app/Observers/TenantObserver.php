<?php

namespace App\Observers;

use App\Jobs\Tenant\TenantCreateBanksJob;
use App\Jobs\Tenant\TenantCreateBFloorJob;
use App\Jobs\Tenant\TenantCreateChannelsJob;
use App\Jobs\Tenant\TenantCreateCitizensJob;
use App\Jobs\Tenant\TenantCreateHotelSettingsJob;
use App\Jobs\Tenant\TenantCreatePermissionsJob;
use App\Jobs\Tenant\TenantCreatePricingPolicySettingsJob;
use App\Jobs\Tenant\TenantCreateUserJob;
use App\Models\Tenant;

class TenantObserver
{
    public function created(Tenant $tenant): void
    {
        TenantCreateUserJob::dispatch($tenant)->onQueue('tenant');
        TenantCreatePermissionsJob::dispatch($tenant)->onQueue('tenant');
        TenantCreateBFloorJob::dispatch($tenant)->onQueue('tenant');
        TenantCreateBanksJob::dispatch($tenant)->onQueue('tenant');
        TenantCreateCitizensJob::dispatch($tenant)->onQueue('tenant');
        TenantCreateChannelsJob::dispatch($tenant)->onQueue('tenant');
        TenantCreatePricingPolicySettingsJob::dispatch($tenant)->onQueue('tenant');
        TenantCreateHotelSettingsJob::dispatch($tenant)->onQueue('tenant');

    }

    public function deleted(Tenant $tenant): void
    {
    }

    public function forceDeleted(Tenant $tenant): void
    {
    }
}
