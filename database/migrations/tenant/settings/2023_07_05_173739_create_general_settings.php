<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration {
	public function up(): void
	{
		$this->migrator->add('general.child_age_limit', 17); //17
		$this->migrator->add('general.free_child_max_age', 4); //4
		$this->migrator->add('general.currency', 'TRY');
		$this->migrator->add('general.pricing_currency', 'EUR');
		$this->migrator->add('general.tax_rate', 20);
		$this->migrator->add('general.pricing_policy', 'person_based'); //person_based -  unit_based
		$this->migrator->add('general.checkin_policy', ['check_in_time' => '14:00:00', 'check_out_time' => '11:00:00']); //check_in - check_out
	}
};
