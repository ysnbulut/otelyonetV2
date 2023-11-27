<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
	public int $child_age_limit;
	public int $free_child_max_age;
	public string $pricing_currency;
	public string $currency;
	public int $tax_rate;
	public string $pricing_policy;
	public array $checkin_policy;

	public static function group(): string
	{
		return 'general';
	}
}
