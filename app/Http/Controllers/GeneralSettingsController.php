<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;

class GeneralSettingsController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(GeneralSettings $settings)
	{
		return view('hotel.pages.settings.general.index', [
			'settings' => $settings,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, GeneralSettings $settings)
	{
		$settings->child_age_limit = $request->child_age_limit;
		$settings->free_child_max_age = $request->free_child_max_age;
		$settings->currency = $request->currency;
		$settings->pricing_currency = $request->pricing_currency;
		$settings->tax_rate = $request->tax_rate;
		$settings->pricing_policy = $request->pricing_policy;
		$settings->checkin_policy['check_in_time'] = $request->check_in_time;
		$settings->checkin_policy['check_out_time'] = $request->check_out_time;
		$settings->save();
		return redirect()
			->route('hotel.settings.index')
			->with('success', 'Otel Ayarları Güncellendi!');
	}
}
