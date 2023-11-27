<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerPaymentsRequest extends FormRequest
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
			'customer_id' => 'required|exists:customers,id',
			'booking_id' => 'sometimes|exists:bookings,id',
			'case_and_banks_id' => 'required|exists:case_and_banks,id',
			'payment_date' => 'required|date_format:Y-m-d',
			'currency' => 'required|in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK',
			'currency_amount' => 'required|min:0',
			'amount_paid' => 'required|min:0',
			'payment_method' => 'required|in:cash,credit_card,bank_transfer',
			'description' => 'nullable|string',
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
			'customer_id.required' => 'Müşteri gerekli.',
			'customer_id.exists' => 'Müşteri bulunamadı.',
			'booking_id.exists' => 'Rezervasyon bulunamadı.',
			'case_and_banks_id.required' => 'Kasa ve Banka gerekli.',
			'case_and_banks_id.exists' => 'Kasa ve Banka bulunamadı.',
			'payment_date.required' => 'Tarih gerekli.',
			'payment_date.date_format' => 'Tarih geçersiz.',
			'currency.required' => 'Para birimi gerekli.',
			'currency.in' => 'Para birimi geçersiz.',
			'currency_amount.required' => 'Para birimi tutarı gerekli.',
			'currency_amount.min' => 'Para birimi tutarı geçersiz.',
			'amount_paid.required' => 'Ödenen tutar gerekli.',
			'amount_paid.min' => 'Ödenen tutar geçersiz.',
			'payment_method.required' => 'Ödeme yöntemi gerekli.',
			'payment_method.in' => 'Ödeme yöntemi geçersiz.',
			'description.string' => 'Açıklama geçersiz.',
		];
	}
}
