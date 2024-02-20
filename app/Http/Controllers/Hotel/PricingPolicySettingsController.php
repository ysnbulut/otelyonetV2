<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePricingPolicySettingsRequest;
use App\Settings\PricingPolicySettings;
use Inertia\Inertia;

class PricingPolicySettingsController extends Controller
{
    private PricingPolicySettings $settings;

    public function __construct(PricingPolicySettings $settings)
    {
        $this->settings = $settings;
    }

    public function index()
    {
        return Inertia::render('Hotel/PricingPolicySettings/Edit', [
            'settings' => $this->settings->toArray(),
        ]);
    }

    public function update(UpdatePricingPolicySettingsRequest $request, PricingPolicySettings $settings)
    {
        $fillData = $settings->toArray();
        collect($request->all())->each(function ($value, $key) use (&$fillData) {
            $fillData[$key]['value'] = $value;
        });
        $settings->fill($fillData);
        $settings->save();
        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}
