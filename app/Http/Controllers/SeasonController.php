<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Http\Requests\StoreSeasonRequest;
use App\Http\Requests\UpdateSeasonRequest;

class SeasonController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
  //
 }

 /**
  * Show the form for creating a new resource.
  */
 public function create()
 {
  return view('hotel.pages.seasons.create_and_edit', [
   'seasons' => Season::get(['id', 'uid', 'name', 'start_date', 'end_date']),
  ]);
 }

 /**
  * Store a newly created resource in storage.
  */
 public function store(StoreSeasonRequest $request)
 {
  $season = Season::create($request->validated());
  return $season;
 }

 /**
  * Display the specified resource.
  */
 public function show(Season $season)
 {
  //
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(Season $season)
 {
  //
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdateSeasonRequest $request, Season $season)
 {
  $data = $request->validated();
  $season->fill([
   'uid' => $data['uid'],
   'name' => $data['name'],
   'start_date' => $data['start_date'],
   'end_date' => $data['end_date'],
  ]);
  $season->update($season->getDirty());
  return $season;
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy(Season $season)
 {
  $season->delete();
  return $season;
 }
}
