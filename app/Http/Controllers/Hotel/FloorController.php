<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\Floor;
use App\Http\Requests\StoreFloorRequest;
use App\Http\Requests\UpdateFloorRequest;
use Inertia\Inertia;

class FloorController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return Inertia::render('Hotel/Floor/Index', [
			'floors' => Floor::orderBy('id')
				->select(['id', 'name'])
				->paginate(10)
				->withQueryString()
				->through(function ($floor) {
					return [
						'id' => $floor->id,
						'name' => $floor->name,
					];
				}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.floors.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreFloorRequest $request)
	{
		$data = $request->validated();
		$data['building_id'] = 1;
		Floor::create($data);
		return redirect()
			->route('hotel.floors.index')
			->with('success', 'Kat ekleme başarılı.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Floor $floor)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Floor $floor)
	{
		return view('hotel.pages.floors.edit', [
			'floor' => $floor,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateFloorRequest $request, Floor $floor)
	{
		$floor->update($request->validated());
		return redirect()
			->route('hotel.floors.index')
			->with('success', 'Kat güncelleme başarılı.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Floor $floor)
	{
		$floor->rooms()->delete();
		$floor->delete();
		return redirect()
			->route('hotel.floors.index')
			->with('success', 'Kat silme başarılı.');
	}
}
