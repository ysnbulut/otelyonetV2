<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'document_id' => ['sometimes', 'integer', 'exists:documents,id'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'type' => ['required', 'in:income,expense'],
            'payment_date' => ['required', 'date', 'date_format:d.m.Y'],
            'bank_id' => ['required', 'integer', 'exists:banks,id'],
            'currency' => ['required', 'in:TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK,NOK'],
            'currency_rate' => ['required', 'numeric'],
            'payment_method' => ['required', 'in:cash,credit_card,virtual_pos,bank_transfer'],
            'amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages() : array
    {
        return [
            'document_id.exists' => 'Belirtilen Folyo bulunamadı.',
            'customer_id.required' => 'Müşteri boş bırakılamaz.',
            'customer_id.exists' => 'Belirtilen müşteri bulunamadı.',
            'type.required' => 'İşlem Tipi alanı boş bırakılamaz.',
            'type.in' => 'İşlem Tipi alanı income/expense olmalıdır.',
            'payment_date.required' => 'Ödeme Tarihi alanı boş bırakılamaz.',
            'payment_date.date' => 'Ödeme Tarihi alanı tarih olmalıdır.',
            'payment_date.date_format' => 'Ödeme Tarihi alanı gün.ay.yıl formatında olmalıdır.',
            'bank_id.required' => 'Banka alanı boş bırakılamaz.',
            'bank_id.exists' => 'Belirtilen banka bulunamadı.',
            'currency.required' => 'Para Birimi alanı boş bırakılamaz.',
            'currency.in' => 'Para Birimi alanı TRY,USD,EUR,GBP,SAR,AUD,CHF,CAD,KWD,JPY,DKK,SEK veya NOK olmalıdır.',
            'currency_rate.required' => 'Döviz Kuru alanı boş bırakılamaz.',
            'currency_rate.numeric' => 'Döviz Kuru alanı sayı olmalıdır.',
            'payment_method.required' => 'Ödeme Yöntemi alanı boş bırakılamaz.',
            'payment_method.in' => 'Ödeme Yöntemi alanı doğru/yanlış olmalıdır.',
            'amount.required' => 'Tutar alanı boş bırakılamaz.',
            'amount.numeric' => 'Tutar alanı sayı olmalıdır.',
            'amount.min' => 'Tutar alanı en az 0 olmalıdır.',
            'description.string' => 'Açıklama alanı metin olmalıdır.',
            'description.max' => 'Açıklama alanı en fazla 255 karakter olmalıdır.',
        ];
    }
}
