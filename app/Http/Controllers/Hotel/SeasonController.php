<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSeasonRequest;
use App\Http\Requests\UpdateSeasonRequest;
use App\Models\Season;
use Inertia\Inertia;

class SeasonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    private function getSeasons()
    {
       return Season::get(['id', 'uid', 'name', 'description', 'start_date', 'end_date'])->map(function
       ($season) {
           $randomColors = $this->getRandomColors();
           return ['id' => $season->id,
               'uid' => $season->uid,
               'name' => $season->name,
               'description' => $season->description,
               'start_date' => $season->start_date,
               'end_date' => $season->end_date,
//                'unit_prices' => $season->unitPrices->map(fn($unitPrice) => [
//                    'id' => $unitPrice->id,
//                    'unit_price' => $unitPrice->unit_price,
//                ]),
               'backgroundColor' => $randomColors['backgroundColor'],
               'textColor' => $randomColors['textColor'],
               'borderColor' => $randomColors['borderColor']
           ];
       });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSeasonRequest $request)
    {
        Season::create($request->validated());
        return $this->getSeasons();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('Hotel/Season/Index', [
            'seasons' => $this->getSeasons(),
        ]);
    }

    protected function getRandomColors(): array
    {
        $maxBrightness = 200;  // Minimum brightness for background color
        $minTextColorDiff = 150;  // Minimum difference in brightness for text color
        $maxAttempts = 10;  // Maximum attempts to find suitable colors

        $attempts = 0;
        do {
            // Generate a random background color
            $backgroundColor = "#" . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

            // Calculate brightness of the background color
            list($r, $g, $b) = sscanf($backgroundColor, "#%02x%02x%02x");
            $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;

            $attempts++;

            // Check if the brightness and contrast conditions are met
        } while ($brightness > $maxBrightness && $attempts < $maxAttempts);

        // Calculate text color based on background brightness
        $textColor = ($brightness > 128) ? "#000000" : "#FFFFFF";

        // Calculate a slightly darker border color
        list($r, $g, $b) = sscanf($backgroundColor, "#%02x%02x%02x");
        $borderColorR = max(0, $r - 20);
        $borderColorG = max(0, $g - 20);
        $borderColorB = max(0, $b - 20);
        $borderColor = sprintf("#%02x%02x%02x", $borderColorR, $borderColorG, $borderColorB);

        return array(
            "backgroundColor" => $backgroundColor,
            "textColor" => $textColor,
            "borderColor" => $borderColor
        );
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
