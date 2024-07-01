<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePricingPolicySettingsRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pricing_policy' => ['required', 'string', 'in:person_based,unit_based'],
            'baby_age_limit' => ['required', 'numeric', 'min:0', 'max:5'],
            'child_age_limit' => ['required', 'numeric', 'gt:baby_age_limit', 'max:20'],
            'free_child_or_baby_max_age' => ['required', 'numeric', 'min:0', 'lte:child_age_limit'],
            'free_child_or_baby_max_number' => ['required', 'numeric', 'min:0', 'max:5'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'currency' => ['required', 'in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK'],
            'pricing_currency' => ['required', 'in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK'],
            'check_in_time_policy' => ['required', 'string', 'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'check_out_time_policy' => ['required', 'string', 'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'accommodation_type' => ['required', 'string', 'in:only_room,room_and_breakfast,half_board,full_board,all_inclusive,ultra_all_inclusive'],
        ];
    }

    public function messages(): array
    {
        return [
            'pricing_policy.required' => 'Satış fiyatlandırma politikası alanı boş bırakılamaz.',
            'pricing_policy.string' => 'Satış fiyatlandırma politikası alanı geçerli bir değer olmalıdır.',
            'pricing_policy.in' => 'Satış fiyatlandırma politikası alanı geçerli bir değer olmalıdır.',
            'baby_age_limit.required' => 'Bebek yaş sınırı alanı boş bırakılamaz.',
            'baby_age_limit.numeric' => 'Bebek yaş sınırı alanı geçerli bir değer olmalıdır.',
            'baby_age_limit.min' => 'Bebek yaş sınırı alanı en az 0 olmalıdır.',
            'baby_age_limit.max' => 'Bebek yaş sınırı alanı en fazla 5 olmalıdır.',
            'child_age_limit.required' => 'Çocuk yaş sınırı alanı boş bırakılamaz.',
            'child_age_limit.numeric' => 'Çocuk yaş sınırı alanı geçerli bir değer olmalıdır.',
            'child_age_limit.gt' => 'Çocuk yaş sınırı alanı bebek yaş sınırından büyük olmalıdır.',
            'child_age_limit.max' => 'Çocuk yaş sınırı alanı en fazla 20 olmalıdır.',
            'free_child_or_baby_max_age.required' => 'Ücretsiz çocuk veya bebek yaş sınırı alanı boş bırakılamaz.',
            'free_child_or_baby_max_age.numeric' => 'Ücretsiz çocuk veya bebek yaş sınırı alanı geçerli bir değer olmalıdır.',
            'free_child_or_baby_max_age.min' => 'Ücretsiz çocuk veya bebek yaş sınırı alanı en az 0 olmalıdır.',
            'free_child_or_baby_max_age.lte' => 'Ücretsiz çocuk veya bebek yaş sınırı alanı çocuk yaş sınırından küçük olmalıdır.',
            'free_child_or_baby_max_number.required' => 'Ücretsiz çocuk veya bebek sayısı alanı boş bırakılamaz.',
            'free_child_or_baby_max_number.numeric' => 'Ücretsiz çocuk veya bebek sayısı alanı geçerli bir değer olmalıdır.',
            'free_child_or_baby_max_number.min' => 'Ücretsiz çocuk veya bebek sayısı alanı en az 0 olmalıdır.',
            'free_child_or_baby_max_number.max' => 'Ücretsiz çocuk veya bebek sayısı alanı en fazla 5 olmalıdır.',
            'tax_rate.required' => 'Vergi oranı alanı boş bırakılamaz.',
            'tax_rate.numeric' => 'Vergi oranı alanı geçerli bir değer olmalıdır.',
            'tax_rate.min' => 'Vergi oranı alanı en az 0 olmalıdır.',
            'tax_rate.max' => 'Vergi oranı alanı en fazla 100 olmalıdır.',
            'currency.required' => 'Para birimi alanı boş bırakılamaz.',
            'currency.in' => 'Para birimi alanı geçerli bir değer olmalıdır.',
            'pricing_currency.required' => 'Fiyatlandırma para birimi alanı boş bırakılamaz.',
            'pricing_currency.in' => 'Fiyatlandırma para birimi alanı geçerli bir değer olmalıdır.',
            'check_in_time_policy.required' => 'Giriş saati politikası alanı boş bırakılamaz.',
            'check_in_time_policy.string' => 'Giriş saati politikası alanı geçerli bir değer olmalıdır.',
            'check_in_time_policy.regex' => 'Giriş saati politikası alanı geçerli bir değer olmalıdır.',
            'check_out_time_policy.required' => 'Çıkış saati politikası alanı boş bırakılamaz.',
            'check_out_time_policy.string' => 'Çıkış saati politikası alanı geçerli bir değer olmalıdır.',
            'check_out_time_policy.regex' => 'Çıkış saati politikası alanı geçerli bir değer olmalıdır.',
            'accommodation_types.required' => 'Konaklama türü alanı boş bırakılamaz.',
            'accommodation_types.string' => 'Konaklama türü alanı geçerli bir değer olmalıdır.',
            'accommodation_types.in' => 'Konaklama türü alanı geçerli bir değer olmalıdır.',
        ];
    }

}
