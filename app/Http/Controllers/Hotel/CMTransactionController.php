<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\CMTransaction;
use Illuminate\Http\Request;

class CMTransactionController extends Controller
{
    public function index()
    {
        return CMTransaction::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cmtid' => ['required', 'integer'],
            'failed_counts' => ['required', 'integer'],
            'succeeded_counts' => ['required', 'integer'],
            'in_progress_counts' => ['required', 'integer'],
        ]);

        return CMTransaction::create($data);
    }

    public function show(CMTransaction $cMTransaction)
    {
        return $cMTransaction;
    }

    public function update(Request $request, CMTransaction $cMTransaction)
    {
        $data = $request->validate([
            'cmtid' => ['required', 'integer'],
            'failed_counts' => ['required', 'integer'],
            'succeeded_counts' => ['required', 'integer'],
            'in_progress_counts' => ['required', 'integer'],
        ]);

        $cMTransaction->update($data);

        return $cMTransaction;
    }

    public function destroy(CMTransaction $cMTransaction)
    {
        $cMTransaction->delete();

        return response()->json();
    }
}
