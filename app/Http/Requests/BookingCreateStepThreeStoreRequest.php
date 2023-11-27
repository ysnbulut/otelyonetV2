<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Settings\GeneralSettings;
use Illuminate\Validation\Rule;
use App\Models\Room;

class BookingCreateStepThreeStoreRequest extends FormRequest
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
   'check_in' => 'required|date_format:Y-m-d|after_or_equal:today',
   'check_out' => 'nullable|date_format:Y-m-d|after:check_in',
   'number_of_adults' => 'required|integer|min:1',
   'number_of_children' => 'required|integer|min:0',
   'children_ages' => 'required_if:number_of_children,>=,1|nullable|array',
   'children_ages.*' => 'required_if:number_of_children,>=,1|nullable|integer|min:0|max:' . $settings->child_age_limit,
   'room_id' => 'required|integer|exists:rooms,id',
   'price' => 'required|min:0',
   'campaign' => 'required|min:0', //|integer|exists:campaigns,id
   'discount' => 'required|min:0',
   'total_price' => 'required|min:0',
   'tax' => 'required|min:0',
   'grand_total' => 'required|min:0',
   'new_customer' => 'required|boolean',
   'customer_id' => 'required_if:new_customer,false|nullable|integer|exists:customers,id',
   'customer_name' => 'required_if:new_customer,true|nullable|string|max:255',
   'type' => 'required|in:company,individual',
   'tax_number' => 'required|string|max:255',
   'city' => 'required|string|max:255',
   'country' => 'required|string|max:255',
   'address' => 'required|string',
   'phone' => 'required|string|max:255',
   'email' => 'required|email|max:255',
  ];
 }

 /**
  * Get the error messages for the defined validation rules.
  *
  * @return array<string, string>
  */
 public function messages(): array
 {
  $settings = new GeneralSettings();
  return [
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
   'children_ages.*.max' => 'Çocuk Yaşları alanı ' . $settings->child_age_limit . '\'den büyük olamaz.',
   'room_id.required' => 'Oda alanı boş bırakılamaz.',
   'room_id.integer' => 'Oda alanı sayı olmalıdır.',
   'room_id.exists' => 'Oda alanı geçerli bir oda olmalıdır.',
   'price.required' => 'Fiyat alanı boş bırakılamaz.',
   'price.numeric' => 'Fiyat alanı sayı olmalıdır.',
   'price.min' => 'Fiyat alanı 0\'dan küçük olamaz.',
   'campaign.required' => 'Kampanya alanı boş bırakılamaz.',
   'campaign.numeric' => 'Kampanya alanı sayı olmalıdır.',
   'campaign.min' => 'Kampanya alanı 0\'dan küçük olamaz.',
   // 'campaign.integer' => 'Kampanya alanı sayı olmalıdır.',
   // 'campaign.exists' => 'Kampanya alanı geçerli bir kampanya olmalıdır.',
   'discount.required' => 'İndirim alanı boş bırakılamaz.',
   'discount.numeric' => 'İndirim alanı sayı olmalıdır.',
   'discount.min' => 'İndirim alanı 0\'dan küçük olamaz.',
   'total_price.required' => 'Toplam Fiyat alanı boş bırakılamaz.',
   'total_price.numeric' => 'Toplam Fiyat alanı sayı olmalıdır.',
   'total_price.min' => 'Toplam Fiyat alanı 0\'dan küçük olamaz.',
   'total_price.max' => 'Toplam Fiyat alanı Fiyat alanından büyük olamaz.',
   'tax.required' => 'Vergi alanı boş bırakılamaz.',
   'tax.numeric' => 'Vergi alanı sayı olmalıdır.',
   'tax.min' => 'Vergi alanı 0\'dan küçük olamaz.',
   'grand_total.required' => 'Genel Toplam alanı boş bırakılamaz.',
   'grand_total.numeric' => 'Genel Toplam alanı sayı olmalıdır.',
   'grand_total.min' => 'Genel Toplam alanı 0\'dan küçük olamaz.',
   'new_customer.required' => 'Yeni Müşteri alanı boş bırakılamaz.',
   'new_customer.boolean' => 'Yeni Müşteri alanı doğru/yanlış olmalıdır.',
   'customer_id.required_if' => 'Müşteri alanı boş bırakılamaz.',
   'customer_id.integer' => 'Müşteri alanı sayı olmalıdır.',
   'customer_id.exists' => 'Müşteri alanı geçerli bir müşteri olmalıdır.',
   'customer_name.required_if' => 'Müşteri alanı boş bırakılamaz.',
   'customer_name.string' => 'Müşteri alanı metin olmalıdır.',
   'customer_name.max' => 'Müşteri alanı en fazla 255 karakter olmalıdır.',
   'type.required' => 'Müşteri Tipi alanı boş bırakılamaz.',
   'type.in' => 'Müşteri Tipi alanı doğru/yanlış olmalıdır.',
   'tax_number.required' => 'Vergi Numarası alanı boş bırakılamaz.',
   'tax_number.string' => 'Vergi Numarası alanı metin olmalıdır.',
   'tax_number.max' => 'Vergi Numarası alanı en fazla 255 karakter olmalıdır.',
   'city.required' => 'Şehir alanı boş bırakılamaz.',
   'city.string' => 'Şehir alanı metin olmalıdır.',
   'city.max' => 'Şehir alanı en fazla 255 karakter olmalıdır.',
   'country.required' => 'Ülke alanı boş bırakılamaz.',
   'country.string' => 'Ülke alanı metin olmalıdır.',
   'country.max' => 'Ülke alanı en fazla 255 karakter olmalıdır.',
   'address.required' => 'Adres alanı boş bırakılamaz.',
   'address.string' => 'Adres alanı metin olmalıdır.',
   'phone.required' => 'Telefon alanı boş bırakılamaz.',
   'phone.string' => 'Telefon alanı metin olmalıdır.',
   'phone.max' => 'Telefon alanı en fazla 255 karakter olmalıdır.',
   'email.required' => 'E-posta alanı boş bırakılamaz.',
   'email.email' => 'E-posta alanı geçerli bir e-posta olmalıdır.',
   'email.max' => 'E-posta alanı en fazla 255 karakter olmalıdır.',
  ];
 }
}
