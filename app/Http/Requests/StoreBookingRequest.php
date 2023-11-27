<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
   // 'room' => 'some|exists:rooms,id',
   'check_in' => 'required|date_format:Y-m-d|after_or_equal:today',
   'check_out' => 'required|date_format:Y-m-d|after:check_in',
   'number_of_adults' => 'required|numeric|min:1',
   'number_of_children' => 'required|numeric|min:0',
   'children_ages' => 'some|array',
   // 'price' => 'some',
  ];
 }
}
