<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
//use App\Settings\GeneralSettings;
//use Illuminate\Validation\Rule;
//use App\Models\Room;

class BookingCreateStepFourStoreRequest extends FormRequest
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
  return [
   'guests' => 'required|array',
   'guests.*.name' => 'required|string|max:255',
   'guests.*.surname' => 'required|string|max:255',
   'guests.*.nationality' => 'required|string|max:255',
   'guests.*.gender' => 'required|in:male,female,unspecified',
   'guests.*.identification_number' => 'required|string|max:255|unique:guests,identification_number',
   'guests.*.email' => 'required|email|max:255',
   'guests.*.phone' => 'required|string|max:255',
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
   'guests.required' => 'En az 1 adet misafir girişi yapmalısınız.',
   'guests.*.name.required' => 'Misafir adı alanı zorunludur.',
   'guests.*.name.string' => 'Misafir adı alanı metin tipinde olmalıdır.',
   'guests.*.name.max' => 'Misafir adı alanı en fazla 255 karakter olmalıdır.',
   'guests.*.surname.required' => 'Misafir soyadı alanı zorunludur.',
   'guests.*.surname.string' => 'Misafir soyadı alanı metin tipinde olmalıdır.',
   'guests.*.surname.max' => 'Misafir soyadı alanı en fazla 255 karakter olmalıdır.',
   'guests.*.nationality' => 'Misafir uyruğu alanı zorunludur.',
   'guests.*.nationality.string' => 'Misafir uyruğu alanı metin tipinde olmalıdır.',
   'guests.*.nationality.max' => 'Misafir uyruğu alanı en fazla 255 karakter olmalıdır.',
   'guests.*.gender.required' => 'Misafir cinsiyet alanı zorunludur.',
   'guests.*.gender.in' => 'Misafir cinsiyet alanı erkek, kadın veya belirtilmemiş olmalıdır.',
   'guests.*.identification_number.required' => 'Misafir kimlik numarası alanı zorunludur.',
   'guests.*.identification_number.string' => 'Misafir kimlik numarası alanı metin tipinde olmalıdır.',
   'guests.*.identification_number.max' => 'Misafir kimlik numarası alanı en fazla 255 karakter olmalıdır.',
   'guests.*.identification_number.unique' => 'Misafir kimlik numarası alanı daha önce kayıt edilmiştir.',
   'guests.*.email.required' => 'Misafir e-posta adresi alanı zorunludur.',
   'guests.*.email.email' => 'Misafir e-posta adresi alanı e-posta tipinde olmalıdır.',
   'guests.*.email.max' => 'Misafir e-posta adresi alanı en fazla 255 karakter olmalıdır.',
   'guests.*.phone.required' => 'Misafir telefon numarası alanı zorunludur.',
   'guests.*.phone.string' => 'Misafir telefon numarası alanı metin tipinde olmalıdır.',
   'guests.*.phone.max' => 'Misafir telefon numarası alanı en fazla 255 karakter olmalıdır.',
  ];
 }
}
