<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HotelRunnerController extends Controller
{
    public function api()
    {
       return Inertia::render('Hotel/ChannelManagers/HotelRunnerApi');
    }
}
