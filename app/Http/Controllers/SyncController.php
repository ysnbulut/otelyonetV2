<?php

namespace App\Http\Controllers;
set_time_limit(0);

use App\Helpers\Currencies;
use App\Models\BookingDailyPrice;
use App\Models\BookingRoom;
use App\Models\CMBooking;
use App\Models\Hotel;
use App\Models\Tax;
use App\Models\Tenant;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Config;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use JsonException;

class SyncController extends Controller
{

    public Client $client;

    public string $apiDomain = 'https://app.hotelrunner.com/api/v2/apps/reservations?token=%s&hr_id=%s&per_page=100&undelivered=false&reservation_number=%s';

    public string $hr_id = '';

    public string $token = '';

    protected Currencies $currencies;

    public function __construct()
    {
        $this->client = new Client();
        $this->currencies = new Currencies();
    }

    public function index()
    {
        $totalBookingRoomsCount = 0;

        foreach (Tenant::all() as $tenant) {
            Config::set("database.connections.tenant_mysql", [
               "driver" => "mysql",
               "host" => env('DB_HOST'),
               "port" => env('DB_PORT', '3306'),
               "database" => $tenant->tenancy_db_name,
               "username" => env('DB_USERNAME'),
               "password" => env('DB_PASSWORD'),
               "charset" => "utf8mb4",
               "collation" => "utf8mb4_unicode_ci",
               "prefix" => "",
               "strict" => false,
               "engine" => 'innoDB',
           ]);

           \DB::purge('tenant_mysql');
           \DB::reconnect('tenant_mysql');


            $bookingRoomsCount = DB::connection('tenant_mysql')->table('bookings')
                ->count();

            $totalBookingRoomsCount += $bookingRoomsCount;

        }

        return $totalBookingRoomsCount;
    }


    public function getReservation($booking_code)
    {
        $request = $this->client->get(sprintf($this->apiDomain, $this->token, $this->hr_id, $booking_code));

        dd($request->getBody()->getContents());
    }
}
