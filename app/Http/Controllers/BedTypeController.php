<?php

namespace App\Http\Controllers;

use App\Models\BedType;
use App\Http\Requests\StoreBedTypeRequest;
use App\Http\Requests\UpdateBedTypeRequest;

class BedTypeController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return view('hotel.pages.bed_types.index', [
			'bedTypes' => BedType::orderBy('id')
				->select(['id', 'name', 'person_num'])
				->paginate(10)
				->withQueryString()
				->through(function ($bedType) {
					return [
						'id' => $bedType->id,
						'name' => $bedType->name,
						'person_num' => $bedType->person_num,
					];
				}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return view('hotel.pages.bed_types.create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreBedTypeRequest $request)
	{
		BedType::create($request->validated());
		return redirect()
			->route('hotel.bed_types.index')
			->with('success', 'Yatak tipi ekleme başarılı.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(BedType $BedType)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(BedType $BedType)
	{
		return view('hotel.pages.bed_types.edit', [
			'bedType' => $BedType,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateBedTypeRequest $request, BedType $BedType)
	{
		$BedType->fill($request->validated());
		$BedType->update($BedType->getDirty());
		return redirect()
			->route('hotel.bed_types.index')
			->with('success', 'Yatak tipi güncelleme başarılı.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(BedType $BedType)
	{
		$BedType->delete();
		return redirect()
			->route('hotel.bed_types.index')
			->with('success', 'Yatak tipi silme başarılı.');
	}
}
