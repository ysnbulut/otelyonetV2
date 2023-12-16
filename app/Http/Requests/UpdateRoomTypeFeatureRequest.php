<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomTypeFeatureRequest extends FormRequest
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
            'old_order_no' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'new_order_no' => ['required_with:old_order_no,', 'integer', 'min:1', 'max:255'],
            'order_no' => ['sometimes', 'integer', 'min:1', 'max:255'],
            'name' => ['required_with:order_no', 'string', 'max:255', 'unique:room_type_features,name,' .
                $this->room_type_feature],
            'is_paid' => ['required_with:order_no', 'boolean'],
        ];
    }
}
