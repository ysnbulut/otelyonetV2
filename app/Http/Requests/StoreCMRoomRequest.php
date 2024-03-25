<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCMRoomRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'type_has_view_id' => 'required|integer',
            'cm_room_code' => 'required|string',
            'stock' => 'required|integer',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
