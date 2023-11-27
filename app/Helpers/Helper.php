<?php

namespace App\Helpers;

class Helper
{
	public function guestVariations($maxAdultCount, $maxChildrenCount)
	{
		$variations = [];
		for ($adultCount = 1; $adultCount <= $maxAdultCount; $adultCount++) {
			// Yetişkin sayısı 2'den fazla ise maksimum çocuk sayısından 1 eksilterek ayarla
			$maxChildren = ($adultCount > 2) ? $maxChildrenCount - ($adultCount - 2) : $maxChildrenCount;

			for ($childrenCount = 0; $childrenCount <= $maxChildren; $childrenCount++) {
				$variations[] = array('number_of_adults' => $adultCount, 'number_of_children' => $childrenCount);
			}
		}
		return $variations;
	}

}