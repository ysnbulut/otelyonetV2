<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUnitPriceRoomTypeAndViewRequest extends FormRequest
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
   'type_has_view_id' => 'required|exists:type_has_views,id',
   'season_id' => 'nullable|exists:seasons,id',
   'unit_price' => 'required|numeric|min:0',
  ];
 }
}
