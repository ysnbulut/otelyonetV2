<?php

namespace App\Http\Middleware;

use App\Models\TypeHasView;
use App\Settings\GeneralSettings;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;
use Teknomavi\Tcmb\Doviz;
use Teknomavi\Tcmb\Exception\UnknownCurrencyCode;
use Teknomavi\Tcmb\Exception\UnknownPriceType;

class BookingRequest
{
	/**
	 * Handle an incoming request.
	 *
	 * @param Request $request
	 * @param Closure(Request): (Response) $next
	 * @return Response
	 * @throws UnknownCurrencyCode
	 * @throws UnknownPriceType
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$settings = new GeneralSettings();
		if ($request->isMethod('get')) {
			if($request->routeIs('hotel.bookings.create')) {
				$request->session()->forget([
					'type',
					'check_in',
					'check_out',
					'open_booking',
					'number_of_adults',
					'number_of_children',
					'children_ages',
				]);
			}
			if($request->routeIs('hotel.bookings.create.step.one')) {
				if ($request->has('type')) {
					$explode = explode(' - ', $request->get('check_in_out'));
					$request->merge([
						'check_in' => Carbon::createFromFormat('d.m.Y', $explode[0])->format('Y-m-d'),
						'check_out' => Carbon::createFromFormat('d.m.Y', $explode[1])->format('Y-m-d'),
					]);
					unset($request['check_in_out']);
					if($request->type === 'single') {
						$request->session()->put([
							'check_in' => $request->check_in,
							'check_out' => $request->check_out,
							'open_booking' => $request->open_booking,
							'number_of_adults' => $request->number_of_adults,
							'number_of_children' => $request->number_of_children,
							'children_ages' => $request->children_ages,
						]);
						return redirect()->route('hotel.bookings.create.single.step.one', $request->all());
					}
					if($request->type === 'group') {
						unset($request['type']);
						unset($request['open_booking']);
						unset($request['number_of_adults']);
						unset($request['number_of_children']);
						unset($request['children_ages']);
						return redirect()->route('hotel.bookings.create.group.step.one', $request->all());
					}
					unset($request['type']);
				}
			}
			if ($request->routeIs('hotel.bookings.create.single.step.two')) {
				if ($request->has('check_in_out')) {
					$explode = explode(' - ', $request->get('check_in_out'));
					$request->merge([
						'check_in' => Carbon::createFromFormat('d.m.Y', $explode[0])->format('Y-m-d'),
						'check_out' => Carbon::createFromFormat('d.m.Y', $explode[1])->format('Y-m-d'),
					]);
					unset($request['check_in_out']);
					$request->session()->put([
						'check_in' => $request->check_in,
						'check_out' => $request->check_out,
						'open_booking' => $request->open_booking,
						'number_of_adults' => $request->number_of_adults,
						'number_of_children' => $request->number_of_children,
						'children_ages' => $request->children_ages,
					]);
					return redirect()->route('hotel.bookings.create.single.step.two', $request->all());
				}
			}
			if ($request->routeIs('hotel.bookings.create.step.three.create')) {
				if ($request->has('room')) {
					Session::put('room', $request->room);
					unset($request['room']);
				} else {
					$getAvailableRandomRoom = TypeHasView::find($request->type_has_view_id)
						->availableRoomForTypeHasView(
							$request->session()->get('check_in'),
							$request->session()->get('check_out')
						)->first()->rooms->random()->id;
					Session::put('room', $getAvailableRandomRoom);
				}
				if ($request->has('price')) {
					Session::put('price', $request->price);
					unset($request['price']);
				}
				$request->merge([
					'check_in' => $request->session()->get('check_in'),
					'check_out' => $request->session()->get('check_out'),
					'open_booking' => $request->session()->get('open_booking'),
					'number_of_adults' => $request->session()->get('number_of_adults'),
					'number_of_children' => $request->session()->get('number_of_children'),
					'children_ages' => $request->session()->get('children_ages')
				]);
				return redirect()->route('hotel.bookings.create.step.three.create', $request->all());
			}
		}
		if ($request->isMethod('post')) {
			if ($request->routeIs('hotel.bookings.create.step.three.store')) {
				Session::forget('price');
				$price = $this->getCleanAmount($request->price);
				Session::put('price', $price);
				$total_price = $this->getCleanAmount($request->total_price);
				$tax = round(($total_price * $settings->tax_rate) / 100, 2);
				if ($request->has('campaign') && $request->campaign !== null) {
					$campaign = (int)$request->campaign;
					unset($request['campaign']);
					$discount = round($price - $total_price, 2);
				} else {
					$campaign = 0;
					if ($price !== $total_price) {
						$discount = $price != 0 && $price > $total_price ? round($price - $total_price, 2) : 0;
					} else {
						$discount = 0;
					}
				}
				$grand_total = $this->getCleanAmount($request->grand_total);
				if ($request->has('new_customer') && $request->new_customer === 'on') {
					$new_customer = true;
					$customer_id = null;
					$customer_name = $request->customer;
				} else {
					$new_customer = false;
					$customer_id = (int)$request->customer;
					$customer_name = null;
				}
				unset($request['room_number']);
				unset($request['price']);
				unset($request['total_price']);
				unset($request['grand_total']);
				unset($request['customer']);
				$request->merge([
					'check_in' => Session::get('check_in'),
					'check_out' => Session::get('check_out'),
					'open_booking' => Session::get('open_booking'),
					'number_of_adults' => Session::get('number_of_adults'),
					'number_of_children' => Session::get('number_of_children'),
					'children_ages' => Session::get('children_ages'),
					'room_id' => (int)Session::get('room'),
					'price' => floatval($price),
					'campaign' => $campaign,
					'discount' => $discount,
					'total_price' => floatval($total_price),
					'tax' => floatval($tax),
					'grand_total' => floatval($grand_total),
					'new_customer' => $new_customer,
					'customer_id' => $customer_id,
					'customer_name' => $customer_name,
				]);
			}
			if ($request->routeIs('hotel.bookings.create.step.five.store')) {
				$payment_date = Carbon::createFromFormat('d.m.Y', $request->payment_date)->format('Y-m-d');
				$currency_amount = $this->getCleanAmount($request->currency_amount);
				unset($request['payment_date']);
				unset($request['currency_amount']);
				if ($settings->pricing_currency !== 'TRY') {
					if ($request->currency !== 'TRY') {
						if ($currency_amount > 0) {
							$doviz = new Doviz();
							$kur = $doviz->kurAlis($request->currency, Doviz::TYPE_EFEKTIFALIS);
							$amount_paid = round($currency_amount * $kur, 2);
						} else {
							$amount_paid = 0;
						}
					} else {
						$amount_paid = $currency_amount;
					}
				} else {
					$amount_paid = $currency_amount;
				}
				$request->merge([
					'payment_date' => $payment_date,
					'currency_amount' => $currency_amount,
					'amount_paid' => $amount_paid,
				]);
			}
		}
		return $next($request);
	}

	protected function getCleanAmount($amount): float
	{
		return (float)trim(
			str_replace(
				[' TRY', ' USD', ' EUR', ' GBP', ' SAR', ' AUD', ' CHF', ' CAD', ' KWD', ' JPY', ' DKK', ' SEK', ' NOK'],
				'',
				str_replace(',', '', trim($amount))
			)
		);
	}
}
