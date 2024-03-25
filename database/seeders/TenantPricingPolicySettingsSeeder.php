<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class TenantPricingPolicySettingsSeeder extends Seeder
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }
    public function run(): void
    {
        $pricingPolicy = ['label' => 'Oda Satış Politikası', 'description' => 'Oda şatış politikası odanın kişi bazlı mı yoksa ünite bazlı mı fiyatlandırılacağını belirler. Kişi bazlı fiyatlandırmada oda fiyatı kişi sayısına göre değişirken, ünite bazlı fiyatlandırmada oda fiyatı sabittir.', 'name' => 'pricing_policy', 'type' => 'select', //text, number, select, boolean
            'options' => [['label' => 'Kişi Bazlı Fiyatlandırma', 'value' => 'person_based',], ['label' => 'Ünite Bazlı Fiyatlandırma', 'value' => 'unit_based',]], 'value' => 'person_based',];

        $babyAgeLimit = ['label' => 'Bebek yaş sınırı', 'description' => 'Bebek yaş sınırı bebekler bebek yaş sınırını belirler. Bu değerden küçük olan yaştaki çocuklar bebek sayılacaktır. Örn: 2 yazıldığında 0-2 yaş arası bebek sayılacaktır. 2 yaş ve üstü çocuk sayılacaktır.', 'name' => 'baby_age_limit', 'type' => 'number', //text, number, select, boolean
            'options' => [], 'value' => 2,];

        $childAgeLimit = ['label' => 'Çocuk Yaş Sınırı', 'description' => 'Çocuk yaş sınırı çocuklar için yaş sınırını belirler. Bu değerden küçük olan yaştaki çocuklar çocuk sayılacaktır. Örn: 12 yazıldığında bebek yaşı üst limiti bir yukarıdaki değerde 2 olarak belirtildiyse 2-12 yaş arası çocuk sayılacaktır. 12 yaş ve üstü yetişkin sayılacaktır.', 'name' => 'child_age_limit', 'type' => 'number', //text, number, select, boolean
            'options' => [], 'value' => 12,];

        $freeChildOrBabyMaxAge = ['label' => 'Ücretisiz Çocuk Yaş Sınırı', 'description' => 'Otelinizde ücretsiz konaklama hakkı olan çocuk yaşı sınırını belirler. Bu değerden küçük olan yaştaki çocuklar ücretsiz konaklama hakkına sahip olacaktır. Örn: 4 yazıldığında 0-4 yaş arası çocuklar ücretsiz konaklama hakkına sahip olacaktır. 4 yaş ve üstü çocuklar için ücret alınacaktır.', 'name' => 'free_child_or_baby_max_age', 'type' => 'number', //text, number, select, boolean
            'options' => [], 'value' => 4,];

        $freeChildOrBabyMaxNumber = ['label' => 'Ücretsiz Çocuk veya Bebek Max Sayısı', 'description' => 'Otelinizde ücretsiz konaklama hakkı olan çocuk veya bebek sayısını belirler. Bu değerden küçük olan sayıdaki çocuklar ücretsiz konaklama hakkına sahip olacaktır. Örn: 2 yazıldığında 0-2 yaş arası 2 çocuk ücretsiz konaklama hakkına sahip olacaktır. 2 çocuktan fazlası için ücret alınacaktır.', 'name' => 'free_child_or_baby_max_number', 'type' => 'number', //text, number, select, boolean
            'options' => [], 'value' => 2,];

        $taxRate = ['label' => 'Konaklama Vergi Oranı', 'description' => 'Otelinizde uygulanan konaklama vergi oranını belirler. Örn: %20 yazıldığında konaklama fiyatına %20 oranında vergi eklenir.', 'name' => 'tax_rate', 'type' => 'number', //text, number, select, boolean
            'options' => [], 'value' => 20,];

        $currencies = [['label' => 'Türk Lirası', 'value' => 'TRY'], ['label' => 'Amerikan Doları', 'value' => 'USD'], ['label' => 'Euro', 'value' => 'EUR'], ['label' => 'İngiliz Sterlini', 'value' => 'GBP'], ['label' => 'Suudi Arabistan Riyali', 'value' => 'SAR'], ['label' => 'Avustralya Doları', 'value' => 'AUD'], ['label' => 'İsveç Frangı', 'value' => 'CHF'], ['label' => 'Kanada Doları', 'value' => 'CAD'], ['label' => 'Kuveyt Dinarı', 'value' => 'KWD'], ['label' => 'Japon Yeni', 'value' => 'JPY'], ['label' => 'Danimarka Kronu', 'value' => 'DKK'], ['label' => 'İsveç Kronu', 'value' => 'SEK'], ['label' => 'Norveç Kronu', 'value' => 'NOK'],];

        //Selectbox olmalı...
        $currency = ['label' => 'Para birimi (Ülke Para Birimi)', 'description' => 'Otelinizin para birimini belirler. Örn: TL, USD, EUR gibi...', 'name' => 'currency', 'type' => 'select', //text, number, select, boolean
            'options' => $currencies, 'value' => 'TRY',];
        //Selectbox olmalı...
        $pricingCurrency = ['label' => 'Fiyatlandırma Para Birimi', 'description' => 'Otelinizin fiyatlandırma para birimini belirler. Örn: TL, USD, EUR gibi...', 'name' => 'pricing_currency', 'type' => 'select', //text, number, select, boolean
            'options' => $currencies, 'value' => 'TRY',];
        //Selectbox olmalı...
        $checkInTimePolicy = ['label' => 'Check in Saat Politikası', 'description' => 'Otelinizde check in saat politikasını belirler. Örn: 14:00 yazıldığında check in saati 14:00 olarak belirlenir. Check in saati politikası oteldeki check in saatini belirler.', 'name' => 'check_in_time_policy', 'type' => 'select', //text, number, select, boolean
            'options' => [['label' => '00:30', 'value' => '00:30'], ['label' => '11:00', 'value' => '11:00'], ['label' => '11:30', 'value' => '11:30'], ['label' => '12:00', 'value' => '12:00'], ['label' => '12:30', 'value' => '12:30'], ['label' => '13:00', 'value' => '13:00'], ['label' => '13:30', 'value' => '13:30'], ['label' => '14:00', 'value' => '14:00'], ['label' => '14:30', 'value' => '14:30'], ['label' => '15:00', 'value' => '15:00'], ['label' => '15:30', 'value' => '15:30'], ['label' => '16:00', 'value' => '16:00'],], 'value' => '14:00',];

        $checkOutTimePolicy = ['label' => 'Check out Saat Politikası', 'description' => 'Otelinizde check out saat politikasını belirler. Örn: 11:00 yazıldığında check out saati 11:00 olarak belirlenir. Check out saati politikası oteldeki check out saatini belirler.', 'name' => 'check_out_time_policy', 'type' => 'select', //text, number, select, boolean
            'options' => [['label' => '09:00', 'value' => '09:00'], ['label' => '09:30', 'value' => '09:30'], ['label' => '10:00', 'value' => '10:00'], ['label' => '10:30', 'value' => '10:30'], ['label' => '11:00', 'value' => '11:00'], ['label' => '11:30', 'value' => '11:30'], ['label' => '12:00', 'value' => '12:00'], ['label' => '12:30', 'value' => '12:30'], ['label' => '13:00', 'value' => '13:00'], ['label' => '13:30', 'value' => '13:30'], ['label' => '14:00', 'value' => '14:00'],], 'value' => '11:00',];

        $accommodationTypes = ['label' => 'Konaklama Türü', 'description' => 'Otelinizdeki konaklama türünü belirler. Örn: Sadece Oda, Oda Kahvaltı, Yarım Pansiyon, Tam Pansiyon, Herşey Dahil, Ultra Herşey Dahil gibi...', 'name' => 'accommodation_type', 'type' => 'select', 'options' => [['label' => 'Sadece Oda', 'value' => 'only_room',], ['label' => 'Oda Kahvaltı', 'value' => 'room_breakfast',], ['label' => 'Yarım Pansiyon', 'value' => 'half_board',], ['label' => 'Tam Pansiyon', 'value' => 'full_board',], ['label' => 'Herşey Dahil', 'value' => 'all_inclusive',], ['label' => 'Ultra Herşey Dahil', 'value' => 'ultra_all_inclusive',],], 'value' => 'only_room',];

        $this->migrator->add('pricing_policy.pricing_policy', $pricingPolicy); //17
        $this->migrator->add('pricing_policy.baby_age_limit', $babyAgeLimit); //17
        $this->migrator->add('pricing_policy.child_age_limit', $childAgeLimit); //17
        $this->migrator->add('pricing_policy.free_child_or_baby_max_age', $freeChildOrBabyMaxAge); //4
        $this->migrator->add('pricing_policy.free_child_or_baby_max_number', $freeChildOrBabyMaxNumber);
        $this->migrator->add('pricing_policy.tax_rate', $taxRate);
        $this->migrator->add('pricing_policy.currency', $currency);
        $this->migrator->add('pricing_policy.pricing_currency', $pricingCurrency); //person_based -  unit_based
        $this->migrator->add('pricing_policy.check_in_time_policy', $checkInTimePolicy);
        $this->migrator->add('pricing_policy.check_out_time_policy', $checkOutTimePolicy);
        $this->migrator->add('pricing_policy.accommodation_type', $accommodationTypes);
    }
}
