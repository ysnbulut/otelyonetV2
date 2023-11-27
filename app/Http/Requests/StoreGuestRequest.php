<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestRequest extends FormRequest
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
   'name' => ['required', 'string', 'max:255'],
   'surname' => ['required', 'string', 'max:255'],
   'nationality' => ['required', 'string', 'max:255'],
   'identification_number' => ['required', 'string', 'max:255', 'unique:guests,identification_number'],
   'phone' => ['required', 'string', 'max:255'],
   'email' => ['required', 'string', 'email', 'max:255'],
   'gender' => ['required', 'in:male,female,unspecified'],
  ];
 }
}
