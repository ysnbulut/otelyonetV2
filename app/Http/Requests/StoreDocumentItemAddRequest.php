<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentItemAddRequest extends FormRequest
{
    public function rules(): array
    {
        /**
         * item_id
         * name
         * description
         * price
         * quantity
         * tax_name
         * tax_rate
         * tax
         * total
         * discount
         * grand_total
         */
        return [
            'document_id' => ['nullable', 'exists:documents,id'],
            'item_id' => ['nullable', 'integer', 'exists:items,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'numeric', 'min:1'],
            'tax_name' => ['required', 'string', 'max:255'],
            'tax_rate' => ['required', 'numeric', 'min:0'],
            'tax' => ['required', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'grand_total' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'document_id.exists' => 'Folyo bulunamadı.',
            'item_id.exists' => 'Ürün/Hizmet bulunamadı.',
            'name.required' => 'Ürün/Hizmet adı gereklidir.',
            'name.string' => 'Ürün/Hizmet adı metin olmalıdır.',
            'name.max' => 'Ürün/Hizmet adı en fazla :max karakter olmalıdır.',
            'description.string' => 'Açıklama metin olmalıdır.',
            'description.max' => 'Açıklama en fazla :max karakter olmalıdır.',
            'quantity.required' => 'Miktar gereklidir.',
            'quantity.numeric' => 'Miktar sayı olmalıdır.',
            'quantity.min' => 'Miktar en az :min olmalıdır.',
            'price.required' => 'Fiyat gereklidir.',
            'price.numeric' => 'Fiyat sayı olmalıdır.',
            'price.min' => 'Fiyat en az :min olmalıdır.',
            'tax_name.required' => 'Vergi adı gereklidir.',
            'tax_name.string' => 'Vergi adı metin olmalıdır.',
            'tax_name.max' => 'Vergi adı en fazla :max karakter olmalıdır.',
            'tax_rate.required' => 'Vergi oranı gereklidir.',
            'tax_rate.numeric' => 'Vergi oranı sayı olmalıdır.',
            'tax_rate.min' => 'Vergi oranı en az :min olmalıdır.',
            'tax.required' => 'Vergi gereklidir.',
            'tax.numeric' => 'Vergi sayı olmalıdır.',
            'tax.min' => 'Vergi en az :min olmalıdır.',
            'discount.numeric' => 'İndirim sayı olmalıdır.',
            'discount.min' => 'İndirim en az :min olmalıdır.',
            'total.required' => 'Toplam gereklidir.',
            'total.numeric' => 'Toplam sayı olmalıdır.',
            'total.min' => 'Toplam en az :min olmalıdır.',
            'grand_total.numeric' => 'Genel toplam sayı olmalıdır.',
            'grand_total.min' => 'Genel toplam en az :min olmalıdır.',
        ];
    }
}
