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

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array {
        return [
            'old_order_no.integer' => 'Eski sıra numarası tam sayı olmalı.',
            'old_order_no.min' => 'Eski sıra numarası en az 1 olmalı.',
            'old_order_no.max' => 'Eski sıra numarası en fazla 255 olmalı.',
            'new_order_no.required_with' => 'Yeni sıra numarası gerekli.',
            'new_order_no.integer' => 'Yeni sıra numarası tam sayı olmalı.',
            'new_order_no.min' => 'Yeni sıra numarası en az 1 olmalı.',
            'new_order_no.max' => 'Yeni sıra numarası en fazla 255 olmalı.',
            'order_no.integer' => 'Sıra numarası tam sayı olmalı.',
            'order_no.min' => 'Sıra numarası en az 1 olmalı.',
            'order_no.max' => 'Sıra numarası en fazla 255 olmalı.',
            'name.required_with' => 'Olanak adı gerekli.',
            'name.string' => 'Olanak adı metin olmalı.',
            'name.max' => 'Olanak adı en fazla 255 karakter olmalı.',
            'name.unique' => 'Olanak adı daha önce kullanılmış.',
            'is_paid.required_with' => 'Ücretli olup olmadığı gerekli.',
            'is_paid.boolean' => 'Ücretli olup olmadığı doğru formatta değil.',
        ];
    }
}
