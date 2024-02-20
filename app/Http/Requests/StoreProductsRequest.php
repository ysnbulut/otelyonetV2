<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductsRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:product_categories,id'],
            'sku' => ['required', 'string', 'max:255'],
            'price' => ['required', 'string'],
            'tax_rate' => ['required', 'numeric'],
            'description' => ['required', 'string', 'max:255'],
            'photo_path' => ['nullable', 'string'],
            'preparation_time' => ['nullable', 'string'],
            'sales_units' => ['required', 'array', 'exists:sales_units,id'],
            'unit_channel_product_prices' => ['required', 'array'],

        ];
    }
}
