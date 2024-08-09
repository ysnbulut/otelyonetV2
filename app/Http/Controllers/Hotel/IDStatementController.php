<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Hotel\Interfaces\IDStatement;
use App\Models\BookingGuests;
use App\Models\Customer;
use App\Models\Tenant;
use App\Services\KimlikBildirimService;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IDStatementController extends Controller implements IDStatement
{

    public $type;

    public $hotelSettings;

    public $services;

    public function set(string $type = 'jkb'): void
    {
        $this->type = $type;
    }

    public function store(Tenant $tenant, $type, $guest)
    {

        $this->set($type);

        $method = $this->type;

        if (method_exists($this, $method)) {
            call_user_func_array([$this, $method], [$tenant, $guest]);
        } else {
            throw new \Exception("{$method} Bulunamadı.");
        }
    }

    public function jkb($hotel, $guest): void
    {
        $hotel->run(function ($hotel) use ($guest) {
            $booking = BookingGuests::whereGuestId($guest)->firstOrFail();
            $this->hotelSettings = new HotelSettings();
            $this->services = (new KimlikBildirimService($this->hotelSettings->kbs['TssKod'], $this->hotelSettings->kbs['KullaniciTC'], $this->hotelSettings->kbs['Sifre']));
            if($booking->guest->citizen->name == 'TURKIYE') {
                $response = $this->services->musteriKimlikNoGiris([
                    'GRSTRH' => sprintf('%sT%s', (!is_null($booking->check_in_date)) ?  $booking->check_in_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'KIMLIKNO' => $booking->guest->identification_number,
                    'KULLANIMSEKLI' => 'KONAKLAMA',
                    'ODANO' => $booking->booking_room->room->name,
                    'PLKNO' => '',
                    'ADI' => $booking->guest->name,
                    'SOYADI' => $booking->guest->surname,
                    'TELNO' => $booking->guest->phone,
                    'ULKKOD' => 'TURKIYE',
                ]);

            } else {

                $response = $this->services->musteriYabanciGiris([
                    'ADI' => $booking->guest->name,
                    'SOYADI' => $booking->guest->surname,
                    'ANAADI' => '',
                    'BABAADI' => '',
                    'BELGENO' => $booking->guest->identification_number,
                    'CINSIYET' => '',
                    'DOGUMTARIHI' => sprintf('%sT00:00:00', $booking->guest->birthday),
                    'GRSTRH' => sprintf('%sT%s', (!is_null($booking->check_in_date)) ?  $booking->check_in_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'MEDENIHAL' => 'EVLI', // EVLI, BEKAR
                    'ODANO' => $booking->booking_room->room->name,
                    'PLKNO' => '',
                    'TELNO' => $booking->guest->phone,
                    'ULKKOD' => $booking->guest->citizen->name
                ]);
            }

            return response()->json($response);
        });
    }

    public function destroy(Tenant $tenant, $type, $guest)
    {
        $tenant->run(function ($hotel) use ($guest) {
            $booking = BookingGuests::whereGuestId($guest)->firstOrFail();
            $this->hotelSettings = new HotelSettings();
            $this->services = (new KimlikBildirimService($this->hotelSettings->kbs['TssKod'], $this->hotelSettings->kbs['KullaniciTC'], $this->hotelSettings->kbs['Sifre']));
            if($booking->guest->citizen->name == 'TURKIYE') {
                $response = $this->services->musteriKimlikNoCikis(
                [
                    'CKSTIP' => 'TESISTENCIKIS',
                    'CKSTRH' => sprintf('%sT%s', (!is_null($booking->check_out_date)) ?  $booking->check_out_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'KIMLIKNO' => $booking->guest->identification_number,
                ]);
            }   else {
                $response = $this->services->musteriYabanciCikis([
                    'CKSTIP' => 'TESISTENCIKIS',
                    'CKSTRH' => sprintf('%sT%s', (!is_null($booking->check_out_date)) ?  $booking->check_out_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'BELGENO' => $booking->guest->identification_number,
                ]);
            }

            return response()->json($response);
        });
    }
}
