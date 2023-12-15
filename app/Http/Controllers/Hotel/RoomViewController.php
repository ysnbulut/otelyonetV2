<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\RoomView;
use App\Http\Requests\StoreRoomViewRequest;
use App\Http\Requests\UpdateRoomViewRequest;

class RoomViewController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return view('hotel.pages.room_views.index', [
			'roomViews' => RoomView::orderBy('id')
				->select(['id', 'name'])
				->paginate(10)
				->withQueryString()
				->through(function ($roomView) {
					return [
						'id' => $roomView->id,
						'name' => $roomView->name,
					];
				}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.room_views.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreRoomViewRequest $request)
	{
		RoomView::create($request->validated());
		return redirect()
			->route('hotel.room_views.index')
			->with('success', 'Oda Manzarası ekleme başarılı.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(RoomView $roomView)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(RoomView $roomView)
	{
		return view('hotel.pages.room_views.edit', [
			'roomView' => $roomView,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateRoomViewRequest $request, RoomView $roomView)
	{
		$roomView->update($request->validated());
		return redirect()
			->route('hotel.room_views.index')
			->with('success', 'Oda Manzarası güncelleme başarılı.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(RoomView $roomView)
	{
		$roomView->delete();
		return redirect()
			->route('hotel.room_views.index')
			->with('success', 'Oda Manzarası silme başarılı.');
	}
}
