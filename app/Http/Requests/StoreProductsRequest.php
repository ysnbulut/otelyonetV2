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
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'max:255'],
            'category_id' => ['required', 'exists:product_categories,id'],
            'sku' => ['required', 'max:255'],
            'price' => ['required', 'numeric'],
            'description' => ['required', 'max:255'],
            'units' => ['required', 'array'],
            'units.*.id' => ['required', 'exists:sales_units,id'],
            'units.*.channels' => ['required', 'array'],
            'units.*.channels.*.id' => ['required', 'exists:sales_channels,id'],
            'units.*.channels.*.prices' => ['required', 'array'],
            'units.*.channels.*.prices.*.id' => ['required', 'exists:unit_channel_product_prices,id'],
            'units.*.channels.*.prices.*.price' => ['required', 'numeric'],
        ];
    }
}
