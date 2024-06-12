<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSeasonRequest;
use App\Http\Requests\UpdateSeasonRequest;
use App\Models\Season;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use JsonException;
use Random\RandomException;

class SeasonController extends Controller
{
    /**
     * Store a newly created resource in storage.
     * @throws RandomException
     * @throws JsonException
     */
    public function store(StoreSeasonRequest $request): \Illuminate\Http\RedirectResponse
    {
        Season::create(
            [
                'uid' => $request->uid,
                'name' => $request->name,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'channels' => $request->channels,
                'web' => $request->web,
                'agency' => $request->agency,
                'reception' => $request->reception,
                'calendar_colors' => json_encode($this->getRandomColors(), JSON_THROW_ON_ERROR),
            ]
        );
        return redirect()
            ->back()
            ->with('success', 'Sezon oluşturuldu.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Hotel/Season/Index', [
            'seasons' => $this->getSeasons(),
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    private function getSeasons(): Collection
    {
        return Season::get(['id', 'uid', 'name', 'description', 'channels', 'web', 'agency', 'reception', 'start_date', 'end_date', 'calendar_colors'])->map(function ($season) {
            $randomColors = json_decode($season->calendar_colors, true, 512, JSON_THROW_ON_ERROR);
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
                'channels' => $season->channels,
                'web' => $season->web,
                'agency' => $season->agency,
                'reception' => $season->reception,
                'backgroundColor' => $randomColors['backgroundColor'],
                'textColor' => $randomColors['textColor'],
                'borderColor' => $randomColors['borderColor']
            ];
        });
    }

    /**
     * @throws RandomException
     */
    protected function getRandomColors(): array
    {
        $maxBrightness = 200;  // Minimum brightness for background color
//        $minTextColorDiff = 150;  // Minimum difference in brightness for text color
        $maxAttempts = 10;  // Maximum attempts to find suitable colors

        $attempts = 0;
        do {
            // Generate a random background color
            $backgroundColor = "#" . str_pad(dechex(random_int(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

            // Calculate brightness of the background color
            [$r, $g, $b] = sscanf($backgroundColor, "#%02x%02x%02x");
            $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;

            $attempts++;

            // Check if the brightness and contrast conditions are met
        } while ($brightness > $maxBrightness && $attempts < $maxAttempts);

        // Calculate text color based on background brightness
        $textColor = ($brightness > 128) ? "#000000" : "#FFFFFF";

        // Calculate a slightly darker border color
        [$r, $g, $b] = sscanf($backgroundColor, "#%02x%02x%02x");
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
    public function update(UpdateSeasonRequest $request, Season $season): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $season->fill([
            'uid' => $data['uid'],
            'name' => $data['name'],
            'description' => $data['description'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'channels' => $data['channels'],
            'web' => $data['web'],
            'agency' => $data['agency'],
            'reception' => $data['reception'],
        ]);
        $season->update($season->getDirty());
        return redirect()
            ->back()
            ->with('success', 'Sezon güncellendi.');
    }

    public function updateForDrop(UpdateSeasonRequest $request, Season $season): Season
    {
        $season->fill($request->validated());
        $season->update($season->getDirty());
        return $season;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Season $season): Season
    {
        $season->delete();
        return $season;
    }

}
