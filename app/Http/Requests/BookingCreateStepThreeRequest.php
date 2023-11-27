<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Room;
use App\Settings\GeneralSettings;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookingCreateStepThreeRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, ValidationRule|array|string>
	 */
	public function rules(): array
	{
		$settings = new GeneralSettings();
		return [
			'type_has_view_id' => 'required|exists:type_has_views,id',
			'room' => Rule::requiredIf(callback: function () {
				return $this->check_in === Carbon::now()->format('Y-m-d');
			}),
			'check_in' => 'required|date_format:Y-m-d|after_or_equal:today',
			'check_out' => 'required|date_format:Y-m-d|after:check_in',
			'number_of_adults' => 'required|integer|min:1',
			'number_of_children' => 'required|integer|min:0',
			'children_ages' => 'required_if:number_of_children,>=,1|array',
			'children_ages.*' => 'required_if:number_of_children,>=,1|integer|min:0|max:' . $settings->child_age_limit,
			'price' => Rule::requiredIf(function () {
				return !session()->has('price');
			}),
		];
	}

	/**
	 * Get the error messages for the defined validation rules.
	 *
	 * @return array<string, string>
	 */
	public function messages(): array
	{
		return [
			'type_has_view_id.required' => 'Oda tipi seçmek zorunludur.',
			'room.required' => 'Bugüne yapılan rezervasyonlarda oda seçimi gereklidir.',
			'check_in.required' => 'Giriş Tarihi alanı boş bırakılamaz.',
			'check_in.date_format' => 'Giriş Tarihi alanı geçerli bir tarih formatında olmalıdır.',
			'check_in.after_or_equal' => 'Giriş Tarihi alanı bugünden önce olamaz.',
			'check_out.required' => 'Çıkış Tarihi alanı boş bırakılamaz.',
			'check_out.date_format' => 'Çıkış Tarihi alanı geçerli bir tarih formatında olmalıdır.',
			'check_out.after' => 'Çıkış Tarihi alanı Giriş Tarihi alanından önce olamaz.',
			'number_of_adults.required' => 'Yetişkin Sayısı alanı boş bırakılamaz.',
			'number_of_adults.integer' => 'Yetişkin Sayısı alanı sayı olmalıdır.',
			'number_of_adults.min' => 'Yetişkin Sayısı alanı 1\'den küçük olamaz.',
			'number_of_children.required' => 'Çocuk Sayısı alanı boş bırakılamaz.',
			'number_of_children.integer' => 'Çocuk Sayısı alanı sayı olmalıdır.',
			'number_of_children.min' => 'Çocuk Sayısı alanı 0\'dan küçük olamaz.',
			'children_ages.required_if' => 'Çocuk Yaşları alanı boş bırakılamaz.',
			'children_ages.array' => 'Çocuk Yaşları alanı dizi olmalıdır.',
			'children_ages.*.required_if' => 'Çocuk Yaşları alanı boş bırakılamaz.',
			'children_ages.*.integer' => 'Çocuk Yaşları alanı sayı olmalıdır.',
			'children_ages.*.min' => 'Çocuk Yaşları alanı 1\'den küçük olamaz.',
		];
	}
}
