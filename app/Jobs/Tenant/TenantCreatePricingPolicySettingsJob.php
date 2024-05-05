<?php

namespace App\Jobs\Tenant;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\LaravelSettings\Exceptions\SettingAlreadyExists;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class TenantCreatePricingPolicySettingsJob implements ShouldQueue, ShouldBeUnique
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
        $migrator = app(SettingsMigrator::class);

        $this->tenant->run(/**
         * @throws SettingAlreadyExists
         */ function () use ($migrator){
            $defaultPricingPolicySettings = json_decode(file_get_contents(base_path('database/data/defaultSettings.json')), true);
            $migrator->add('pricing_policy.pricing_policy', $defaultPricingPolicySettings['pricing_policy']);
            $migrator->add('pricing_policy.baby_age_limit', $defaultPricingPolicySettings['baby_age_limit']);
            $migrator->add('pricing_policy.child_age_limit', $defaultPricingPolicySettings['child_age_limit']);
            $migrator->add('pricing_policy.free_child_or_baby_max_age', $defaultPricingPolicySettings['free_child_or_baby_max_age']);
            $migrator->add('pricing_policy.free_child_or_baby_max_number', $defaultPricingPolicySettings['free_child_or_baby_max_number']);
            $migrator->add('pricing_policy.tax_rate', $defaultPricingPolicySettings['tax_rate']);
            $migrator->add('pricing_policy.currency', $defaultPricingPolicySettings['currency']);
            $migrator->add('pricing_policy.pricing_currency', $defaultPricingPolicySettings['pricing_currency']);
            $migrator->add('pricing_policy.check_in_time_policy', $defaultPricingPolicySettings['check_in_time_policy']);
            $migrator->add('pricing_policy.check_out_time_policy', $defaultPricingPolicySettings['check_out_time_policy']);
            $migrator->add('pricing_policy.accommodation_type', $defaultPricingPolicySettings['accommodation_type']);
        });
    }
}
