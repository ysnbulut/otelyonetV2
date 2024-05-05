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
}
