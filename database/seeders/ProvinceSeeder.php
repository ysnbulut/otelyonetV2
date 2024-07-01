<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;
use App\Helpers\NviClass;
class ProvinceSeeder extends Seeder
{
    public function run(): void
    {
        $nvi = new NviClass();
        $provinces = $nvi->getProvinces();
        $jd_provinces = json_decode($provinces, true);
        foreach ($jd_provinces['data'] as $key => $province) {
            Province::create(['id' => $province['value'], 'name' => $province['label']]);
        }
    }
}
