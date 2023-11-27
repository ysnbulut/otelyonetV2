<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\RoomType;
use Illuminate\Validation\Rule;

class StorePossibilitiesOfGuestsRoomTypeRequest extends FormRequest
{
 protected $maxCapacity;
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
  $this->maxCapacity = $this->route('room_type')->capacity ? $this->route('room_type')->capacity : 0;
  $roomTypeId = $this->route('room_type')->id;
  $numberOfChildren = $this->number_of_children;
  return [
   'number_of_adults' => [
    'required',
    'integer',
    'min:1',
    'max:' . $this->maxCapacity,
    Rule::unique('possibilities_of_guests_room_types')->where(function ($query) use ($roomTypeId, $numberOfChildren) {
     $query->where('number_of_children', $numberOfChildren)->whereNull('deleted_at');
     if ($roomTypeId) {
      $query->where('room_type_id', $roomTypeId);
     }
    }),
   ],
   'number_of_children' => ['required', 'integer', 'min:0', 'max:10'],
   'deleted_at' => ['nullable', 'date'],
  ];
 }

 /**
  * Get the error messages for the defined validation rules.
  *
  * @return array<string, string>
  */

 public function messages(): array
 {
  return [
   'number_of_adults.required' => 'Yetişkin sayısı gereklidir',
   'number_of_adults.integer' => 'Yetişkin sayısı bir tam sayı olmalıdır',
   'number_of_adults.min' => 'Yetişkin sayısı en az 1 olmalıdır',
   'number_of_adults.max' => 'Yetişkin sayısı en fazla ' . $this->maxCapacity . ' olmalıdır',
   'number_of_adults.unique' => 'Bu varyasyon zaten mevcut',
   'number_of_children.required' => 'Çocuk sayısı gereklidir',
   'number_of_children.integer' => 'Çocuk sayısı bir tam sayı olmalıdır',
   'number_of_children.min' => 'Çocuk sayısı en az 0 olmalıdır',
   'number_of_children.max' => 'Çocuk sayısı en fazla 10 olmalıdır',
  ];
 }
}
