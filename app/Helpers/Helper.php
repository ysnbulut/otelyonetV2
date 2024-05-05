<?php

namespace App\Helpers;
use Carbon\Carbon;

class Helper
{

    public function guestVariations($maxAdultCount, $maxChildrenCount): array
    {
        $variations = [];
        for ($adultCount = 1; $adultCount <= $maxAdultCount; $adultCount++) {
            $maxChildren = ($adultCount > 2) ? $maxChildrenCount - ($adultCount - 2) : $maxChildrenCount;

            for ($childrenCount = 0; $childrenCount <= $maxChildren; $childrenCount++) {
                $variations[] = array('number_of_adults' => $adultCount, 'number_of_children' => $childrenCount);
            }
        }
        return $variations;
    }

    public function datesBetween($startDate, $endDate, $carbon = false, $lastDate = false, $format = 'Y-m-d'): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $dates = [];

        for ($date = $start; $date->lt($end); $date->addDay()) {
            $dates[] = $date->format($format);
        }

        if ($lastDate) {
            $dates[] = $end->format($format);
        }

        if($carbon) {
            return array_map(function ($date) {
                return Carbon::parse($date);
            }, $dates);
        } else {
            return $dates;
        }
    }
}