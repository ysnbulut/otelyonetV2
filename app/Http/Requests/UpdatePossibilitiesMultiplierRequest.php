<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePossibilitiesMultiplierRequest extends FormRequest
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
   'room_type_id' => 'required|exists:room_types,id',
   'possibility_id' => 'required|exists:possibilities_of_guests_room_types,id',
   'multiplier' => 'required|numeric|min:1|max:100',
  ];
 }
}
