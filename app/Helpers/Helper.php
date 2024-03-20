<?php

namespace App\Helpers;

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

    public function gmapParse($link) {
      $pattren = '/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/';
      preg_match($pattren, $link, $matches);
        // Google Maps URL'sinden enlem ve boylamı çıkarmak için bir düzenli ifade kullanın
        // İlk olarak, ilk link formatını kontrol edin
        $pattern_1 = '/@(-?\d+\.\d+),(-?\d+\.\d+)/';
        preg_match($pattern_1, $link, $matches_1);

        // Eğer ilk format eşleşirse, enlem ve boylamı döndürün
        if (count($matches_1) >= 3) {
            $latitude = floatval($matches_1[1]);
            $longitude = floatval($matches_1[2]);
            return [
                'status' => 'success',
                'latitude' => $latitude,
                'longitude' => $longitude
            ];
        } else {
            // Eğer ilk format eşleşmezse, ikinci formatı kontrol edin
            $pattern_2 = '/q=(-?\d+\.\d+),(-?\d+\.\d+)/';
            preg_match($pattern_2, $link, $matches_2);

            // Eğer ikinci format eşleşirse, enlem ve boylamı döndürün
            if (count($matches_2) >= 3) {
                $latitude = floatval($matches_2[1]);
                $longitude = floatval($matches_2[2]);
                return [
                    'status' => 'success',
                    'latitude' => $latitude,
                    'longitude' => $longitude
                ];
            } else {
                // Eşleşme yoksa, null döndürün
                return [
                    'status' => 'error',
                    'message' => 'Google Maps URL\'sini analiz ederken bir hata oluştu'
                ];
            }
        }
    }
}