<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCaseAndBanksRequest extends FormRequest
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
   'name' => 'required|string|max:255',
   'type' => 'required|in:case,bank',
   'currency' => 'required|in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK',
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
   'name.required' => 'Kasa ve Banka adı alanı boş bırakılamaz.',
   'name.string' => 'Kasa ve Banka adı alanı geçerli bir değer olmalıdır.',
   'name.max' => 'Kasa ve Banka adı alanı en fazla 255 karakter olmalıdır.',
   'type.required' => 'Kasa ve Banka türü alanı boş bırakılamaz.',
   'type.in' => 'Kasa ve Banka türü alanı geçerli bir değer olmalıdır.',
   'currency.required' => 'Para birimi alanı boş bırakılamaz.',
   'currency.in' => 'Para birimi alanı geçerli bir değer olmalıdır.',
  ];
 }
}
