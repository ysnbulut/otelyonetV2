<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreItemsRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'image_id' => ['nullable', 'string'],
            'type' => ['required', 'in:product,service,extras'],
            'category_id' => ['required', 'exists:item_categories,id'],
            'price' => ['required', 'string'],
            'tax_id' => ['required', 'numeric'],
            'tax' => ['required', 'string'],
            'total_price' => ['required', 'string'],
            'preparation_time' => ['nullable', 'string'],
            'sales_units' => ['required', 'array', 'exists:sales_units,id'],
            'unit_channel_item_prices' => ['required', 'array'],
        ];
    }
}
