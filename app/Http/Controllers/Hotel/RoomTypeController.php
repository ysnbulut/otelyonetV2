<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use App\Models\BedType;
use App\Models\RoomType;
use App\Models\RoomTypeFeature;
use App\Models\RoomView;
use App\Helpers\Helper;
use Illuminate\Support\Arr;

class RoomTypeController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return view('hotel.pages.room_types.index', [
			'roomTypes' => RoomType::orderBy('id')
				->select(['id', 'name', 'description', 'size', 'adult_capacity', 'child_capacity', 'room_count'])
				->paginate(10)
				->withQueryString()
				->through(function ($roomType) {
					return [
						'id' => $roomType->id,
						'name' => $roomType->name,
						'description' => $roomType->description,
						'size' => $roomType->size,
						'adult_capacity' => $roomType->adult_capacity,
						'child_capacity' => $roomType->child_capacity,
						'room_count' => $roomType->room_count,
					];
				}),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRoomTypeRequest $request)
	{
		$data = $request->validated();
		$inset_data = [
			'name' => $data['name'],
			'size' => $data['size'],
			'adult_capacity' => $data['adult_capacity'],
			'child_capacity' => $data['child_capacity'],
			'room_count' => $data['room_count'],
		];
		$roomtype = RoomType::create($inset_data);
		$roomtype->views()->attach($data['room_type_views']);
		$roomtype->features()->attach($data['room_type_features']);
		$roomtype->beds()->attach(array_values($data['bed_types']));
		$helper = new Helper();
		$roomtype->possibilitiesOfGuests()->createMany($helper->guestVariations($data['adult_capacity'], $data['child_capacity']));

		return redirect()
			->route('hotel.room_types.index')
			->with('success', 'Oda türü başarıyla oluşturuldu.');
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.room_types.create', [
			'roomTypeViews' => RoomView::orderBy('id')->get(['id', 'name']),
			'roomTypeFeatures' => RoomTypeFeature::orderBy('id')->get(['id', 'name']),
			'bedTypes' => BedType::orderBy('id')->get(['id', 'name']),
		]);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(RoomType $roomType)
	{
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(RoomType $roomType)
	{
		return view('hotel.pages.room_types.edit', [
			'roomType' => [
				'id' => $roomType->id,
				'name' => $roomType->name,
				'description' => $roomType->description,
				'size' => $roomType->size,
				'adult_capacity' => $roomType->adult_capacity,
				'child_capacity' => $roomType->child_capacity,
				'room_count' => $roomType->room_count,
				'beds' => $roomType->bedsWithCount->map(fn ($bed) => [
					'id' => $bed->id,
					'name' => $bed->name,
					'count' => $bed->pivot->count,
				]),
				'views' => $roomType->views->pluck('id')->toArray(),
				'features' => $roomType->features->pluck('id')->toArray(),
			],
			'roomTypeViews' => RoomView::orderBy('id')->get(['id', 'name']),
			'roomTypeFeatures' => RoomTypeFeature::orderBy('id')->get(['id', 'name']),
			'bedTypes' => BedType::orderBy('id')->get(['id', 'name']),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateRoomTypeRequest $request, RoomType $roomType)
	{
		$data = $request->validated();
		$roomType->fill([
			'name' => $data['name'],
			'description' => $data['description'],
			'size' => $data['size'],
			'adult_capacity' => $data['adult_capacity'],
			'child_capacity' => $data['child_capacity'],
			'room_count' => $data['room_count'],
		]);
		if(in_array('adult_capacity', array_keys($roomType->getDirty())) || in_array('child_capacity', array_keys($roomType->getDirty()))) {
			$helper = new Helper();
			$roomType->possibilitiesOfGuests()->delete();
			$roomType->possibilitiesOfGuests()->createMany($helper->guestVariations($data['adult_capacity'], $data['child_capacity']));
		}
		$roomType->update($roomType->getDirty());
		$roomType->views()->sync($data['room_type_views']);
		$roomType->features()->sync($data['room_type_features']);
		//bunsuz olmuyor
		$roomType->beds()->detach();
		$roomType->beds()->attach(array_values($data['bed_types']));
		return redirect()
			->route('hotel.room_types.index')
			->with('success', 'Oda türü başarıyla güncellendi.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(RoomType $roomType)
	{
		$roomType->delete();
		return redirect()
			->route('hotel.room_types.index')
			->with('success', 'Oda türü başarıyla silindi.');
	}
}
