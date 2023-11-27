<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
//use App\Settings\GeneralSettings;
//use Illuminate\Validation\Rule;
//use App\Models\Room;

class BookingCreateStepFiveStoreRequest extends FormRequest
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
   'payment_date' => 'required|date_format:Y-m-d',
   'case_and_bank_id' => 'required|integer|exists:case_and_banks,id',
   'payment_method' => 'required|in:cash,credit_card,bank_transfer',
   'currency' => 'required|in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK',
   'currency_amount' => 'required|min:0',
   'amount_paid' => 'required|min:0',
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
   'payment_date.required' => 'Ödeme tarihi alanı boş bırakılamaz.',
   'payment_date.date_format' => 'Ödeme tarihi alanı geçerli bir tarih formatında olmalıdır.',
   'case_and_bank_id.required' => 'Kasa ve Banka alanı boş bırakılamaz.',
   'case_and_bank_id.integer' => 'Kasa ve Banka alanı geçerli bir değer olmalıdır.',
   'case_and_bank_id.exists' => 'Kasa ve Banka alanı geçerli bir değer olmalıdır.',
   'payment_method.required' => 'Ödeme türü alanı boş bırakılamaz.',
   'payment_method.in' => 'Ödeme türü alanı geçerli bir değer olmalıdır.',
   'currency.required' => 'Para birimi alanı boş bırakılamaz.',
   'currency.in' => 'Para birimi alanı geçerli bir değer olmalıdır.',
   'currency_amount.required' => 'Para birimi tutarı alanı boş bırakılamaz.',
   'currency_amount.min' => 'Para birimi tutarı alanı geçerli bir değer olmalıdır.',
   'amount_paid.required' => 'Ödenen tutar alanı boş bırakılamaz.',
   'amount_paid.min' => 'Ödenen tutar alanı geçerli bir değer olmalıdır.',
  ];
 }
}
