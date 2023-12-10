<?php

namespace App\Http\Middleware;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Stancl\Tenancy\Facades\Tenancy;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = tenancy() !== null ?? new GeneralSettings();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user()?->roles->first()?->name ?? 'User',
                'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
                'pricing_policy' => tenancy() !== null ?? $settings->pricing_policy,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'message' => $request->session()->get('message'),
                'info' => $request->session()->get('info'),
                'warning' => $request->session()->get('warning'),
                'status' => $request->session()->get('status'),
                'errors' => $request->session()->get('errors'),
                'old' => $request->session()->get('old'),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
