<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGuestRequest extends FormRequest
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
			'name' => ['required', 'string', 'max:255', 'min:2'],
			'surname' => ['required', 'string', 'max:255', 'min:2'],
            'is_foreign_national' => ['required', 'boolean'],
			'citizen_id' => ['required', 'integer', 'exists:citizens,id'],
            'birthday' => ['required', 'date'],
			'identification_number' => ['required', 'string', 'max:255', 'min:6'], //, 'unique:guests,identification_number'
			'phone' => ['nullable', 'string', 'max:255'],
			'email' => ['nullable', 'string', 'email', 'max:255'],
			'gender' => ['nullable', 'in:male,female,unspecified'],
		];
	}
}
