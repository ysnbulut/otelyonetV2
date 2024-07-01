<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;
use App\Models\District;
use App\Helpers\NviClass;
class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $nvi = new NviClass();
        $provinces = Province::get('id');
        foreach ($provinces as $key => $province) {
            $districts = $nvi->getDistricts($province->id);
            $jd_districts = json_decode($districts, true);
            foreach ($jd_districts['data'] as $key => $district) {
                District::create(['province_id' => $province->id, 'name' => $district['label']]);
            }
        }
    }
}
