<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;


class PricingPolicySettings extends Settings
{
    public array $pricing_policy;
    public array $baby_age_limit;
    public array $child_age_limit;
    public array $free_child_or_baby_max_age;
    public array $free_child_or_baby_max_number;
    public array $tax_rate;
    public array $currency;
    public array $pricing_currency;
    public array $check_in_time_policy;
    public array $check_out_time_policy;
    public array $accommodation_type;

    public static function group(): string
    {
        return 'pricing_policy';
    }
}