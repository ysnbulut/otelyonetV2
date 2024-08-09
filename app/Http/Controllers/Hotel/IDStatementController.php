<?php

namespace App\Http\Controllers\Hotel;

use App\Exceptions\SoapException;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Hotel\Interfaces\IDStatement;
use App\Http\Requests\UpdateIDStatementUpdateRequest;
use App\Models\BookingGuests;
use App\Models\Customer;
use App\Models\Tenant;
use App\Services\KimlikBildirimService;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IDStatementController extends Controller implements IDStatement
{

    public string $type;

    public HotelSettings $hotelSettings;

    public KimlikBildirimService $services;

    public function set(string $type = 'jkb'): void
    {
        $this->type = $type;
    }

    public function store(UpdateIDStatementUpdateRequest $request): void
    {

        $this->hotelSettings = new HotelSettings();
        $this->set($this->hotelSettings->kbs['value']);

        $method = $this->type;

        if (method_exists($this, $method)) {
            call_user_func_array([$this, $method], [$request->booking_guests]);
        } else {
            throw new \Exception("{$method} Bulunamadı.");
        }
    }

    /**
     * @throws SoapException
     */
    public function jkbs(array $guests): \Illuminate\Http\RedirectResponse
    {
        $responses = [];
        foreach ($guests as $guest) {
            $bookingGuest = BookingGuests::findOrFail($guest);
            $this->hotelSettings = new HotelSettings();
            $this->services = (new KimlikBildirimService($this->hotelSettings->kbs_settings['TssKod'], $this->hotelSettings->kbs_settings['KullaniciTC'], $this->hotelSettings->kbs_settings['Sifre']));
            if ($bookingGuest->guest->citizen->name === 'TURKIYE') {
                $response = $this->services->musteriKimlikNoGiris([
                    'GRSTRH' => sprintf('%sT%s', (!is_null($bookingGuest->check_in_date)) ? $bookingGuest->check_in_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'KIMLIKNO' => $bookingGuest->guest->identification_number,
                    'KULLANIMSEKLI' => 'KONAKLAMA',
                    'ODANO' => $bookingGuest->booking_room->room->name,
                    'PLKNO' => '',
                    'ADI' => $bookingGuest->guest->name,
                    'SOYADI' => $bookingGuest->guest->surname,
                    'TELNO' => $bookingGuest->guest->phone,
                    'ULKKOD' => 'TURKIYE',
                ]);
                if ($response['aBasarili'] === 'true') {
                    $bookingGuest->check_in_kbs = true;
                    $bookingGuest->save();
                }
                $responses[] = $response;
            } else {
                $response = $this->services->musteriYabanciGiris([
                    'ADI' => $bookingGuest->guest->name,
                    'SOYADI' => $bookingGuest->guest->surname,
                    'ANAADI' => '',
                    'BABAADI' => '',
                    'BELGENO' => $bookingGuest->guest->identification_number,
                    'CINSIYET' => '',
                    'DOGUMTARIHI' => sprintf('%sT00:00:00', $bookingGuest->guest->birthday),
                    'GRSTRH' => sprintf('%sT%s', (!is_null($bookingGuest->check_in_date)) ? $bookingGuest->check_in_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'MEDENIHAL' => 'EVLI', // EVLI, BEKAR
                    'ODANO' => $bookingGuest->booking_room->room->name,
                    'PLKNO' => '',
                    'TELNO' => $bookingGuest->guest->phone,
                    'ULKKOD' => $bookingGuest->guest->citizen->name
                ]);
                if ($response['aBasarili'] === 'true') {
                    $bookingGuest->check_in_kbs = true;
                    $bookingGuest->save();
                }
                $responses[] = $response;
            }
        }

        return redirect()->back()->with('success', $responses);
    }

    /**
     * @throws SoapException
     */
    public function destroy(UpdateIDStatementUpdateRequest $request): \Illuminate\Http\RedirectResponse
    {
        $responses = [];
        foreach ($request->booking_guests as $guest) {
            $bookingGuest = BookingGuests::findOrFail($guest);
            $this->hotelSettings = new HotelSettings();
            $this->services = (new KimlikBildirimService($this->hotelSettings->kbs_settings['TssKod'], $this->hotelSettings->kbs_settings['KullaniciTC'], $this->hotelSettings->kbs_settings['Sifre']));
            if ($bookingGuest->guest->citizen->name === 'TURKIYE') {
                $response = $this->services->musteriKimlikNoCikis(
                    [
                        'CKSTIP' => 'TESISTENCIKIS',
                        'CKSTRH' => sprintf('%sT%s', (!is_null($bookingGuest->check_out_date)) ? $bookingGuest->check_out_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                        'KIMLIKNO' => $bookingGuest->guest->identification_number,
                    ]);
                if ($response['aBasarili'] === 'true') {
                    $bookingGuest->check_out_kbs = true;
                    $bookingGuest->save();
                }
                $responses[] = $response;
            } else {
                $response = $this->services->musteriYabanciCikis([
                    'CKSTIP' => 'TESISTENCIKIS',
                    'CKSTRH' => sprintf('%sT%s', (!is_null($bookingGuest->check_out_date)) ? $bookingGuest->check_out_date : Carbon::now()->format('Y-m-d'), Carbon::now()->format('H:i:s')),
                    'BELGENO' => $bookingGuest->guest->identification_number,
                ]);
                if ($response['aBasarili'] === 'true') {
                    $bookingGuest->check_out_kbs = true;
                    $bookingGuest->save();
                }
                $responses[] = $response;
            }
        }

        return redirect()->back()->with('success', $responses);
    }
}
