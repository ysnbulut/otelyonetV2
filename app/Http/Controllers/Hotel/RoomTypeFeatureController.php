<?php

namespace App\Http\Controllers\Hotel;
use App\Http\Controllers\Controller;
use App\Models\RoomTypeFeature;
use App\Http\Requests\StoreRoomTypeFeatureRequest;
use App\Http\Requests\UpdateRoomTypeFeatureRequest;
use Inertia\Inertia;

class RoomTypeFeatureController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return Inertia::render('Hotel/Features/Index', [
			'features' => RoomTypeFeature::orderBy('order_no')->get(['id', 'order_no', 'name', 'is_paid']),
            'deletedFeatures' => RoomTypeFeature::orderBy('order_no')->onlyTrashed()->get(['id', 'order_no', 'name', 'is_paid'])
                    ->sortBy('order_no'),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRoomTypeFeatureRequest $request, RoomTypeFeature $roomTypeFeature)
	{
		$data = $request->validated();
        return $roomTypeFeature->create($data);
	}


	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateRoomTypeFeatureRequest $request, int $roomTypeFeatureId)
	{
		$data = $request->validated();
        $roomTypeFeature = RoomTypeFeature::withTrashed()->findOrFail($roomTypeFeatureId);
        if($request->has('old_order_no') && $request->has('new_order_no')) {
            $roomTypeFeature->fill([
                'order_no' => $data['new_order_no'],
            ]);
        } else {
            $roomTypeFeature->fill($data);
        }
		$roomTypeFeature->update($roomTypeFeature->getDirty());
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(RoomTypeFeature $roomTypeFeature)
	{
		$roomTypeFeature->delete();
	}

/**
     * Restore the specified resource from storage.
     */
    public function restore(int $feature_id)
    {
        RoomTypeFeature::onlyTrashed()->findOrFail($feature_id)->restore();
    }

    /**
     * Permanently delete the specified resource from storage.
     */
    public function forceDelete(int $feature_id)
    {
        RoomTypeFeature::onlyTrashed()->findOrFail($feature_id)->forceDelete();
    }
}
