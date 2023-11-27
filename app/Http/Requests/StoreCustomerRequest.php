<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
  * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
  */
 public function rules(): array
 {
  return [
   'title' => 'required|string|max:255',
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
  return [
   'title.required' => 'Müşteri Adı/Ünvan boş bırakılamaz.',
   'title.string' => 'Müşteri Adı/Ünvan metin olmalıdır.',
   'title.max' => 'Müşteri Adı/Ünvan en fazla 255 karakter olmalıdır.',
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
