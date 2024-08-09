<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Site/Index');
    }
}
