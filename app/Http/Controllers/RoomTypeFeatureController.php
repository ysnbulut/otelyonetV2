<?php

namespace App\Http\Controllers;

use App\Models\RoomTypeFeature;
use App\Http\Requests\StoreRoomTypeFeatureRequest;
use App\Http\Requests\UpdateRoomTypeFeatureRequest;

class RoomTypeFeatureController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return view('hotel.pages.room_type_features.index', [
			'roomTypeFeatures' => RoomTypeFeature::orderBy('id')
				->select(['id', 'name'])
				->paginate(10)
				->withQueryString()
				->through(function ($roomTypeFeature) {
					return [
						'id' => $roomTypeFeature->id,
						'name' => $roomTypeFeature->name,
					];
				}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.room_type_features.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRoomTypeFeatureRequest $request)
	{
		$data = $request->validated();
		RoomTypeFeature::create($data);
		return redirect()
			->route('hotel.room_type_features.index')
			->with('success', 'Oda Olanağı ekleme başarılı.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(RoomTypeFeature $roomTypeFeature)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(RoomTypeFeature $roomTypeFeature)
	{
		return view('hotel.pages.room_type_features.edit', [
			'roomTypeFeature' => $roomTypeFeature,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateRoomTypeFeatureRequest $request, RoomTypeFeature $roomTypeFeature)
	{
		$data = $request->validated();
		$roomTypeFeature->fill($data);
		$roomTypeFeature->update($roomTypeFeature->getDirty());
		return redirect()
			->route('hotel.room_type_features.index')
			->with('success', 'Oda Olanağı ' . $roomTypeFeature->name . ' updated.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(RoomTypeFeature $roomTypeFeature)
	{
		$roomTypeFeature->delete();
		return redirect()
			->route('hotel.room_type_features.index')
			->with('success', 'Oda Olanağı ' . $roomTypeFeature->name . ' deleted.');
	}
}
