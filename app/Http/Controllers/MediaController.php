<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function __invoke(Request $request)
    {
        $response = [];

        $path = storage_path('app/public/tmp/uploads');
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $file = $request->file('file');
        $name = uniqid() . '_' . Str::slug(Str::replace($file->getClientOriginalExtension(), '', trim($file->getClientOriginalName
            ()))) . '.' . $file->getClientOriginalExtension();
        $file->move($path, $name);
        return response()->json([
            'name' => $name,
            'original_name' => $file->getClientOriginalName(),
            'url' => asset('tmp/uploads/' . $name),
            'path' => $path.'/'.$name
        ]);
    }
}
