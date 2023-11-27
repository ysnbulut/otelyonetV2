<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class SeasonRequest
{
 /**
  * Handle an incoming request.
  *
  * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
  */
 public function handle(Request $request, Closure $next): Response
 {
  if ($request->has('start_and_end_date')) {
   $explode = explode(' - ', $request->get('start_and_end_date'));
   $request->merge([
    'start_date' => Carbon::createFromFormat('d.m.Y', $explode[0])->format('Y-m-d'),
    'end_date' => Carbon::createFromFormat('d.m.Y', $explode[1])->format('Y-m-d'),
   ]);
   unset($request['start_and_end_date']);
  }
  return $next($request);
 }
}
