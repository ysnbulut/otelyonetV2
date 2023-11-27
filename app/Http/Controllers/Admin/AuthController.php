<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Show specified view.
     */
    public function loginView(): View
    {
        return view('admin.login.main');
    }

	/**
	 * Authenticate login user.
	 *
	 * @param LoginRequest $request
	 * @throws Exception
	 */
    public function login(LoginRequest $request): void
    {
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            throw new Exception('Wrong email or password.');
        }
    }

    /**
     * Logout user.
     */
    public function logout(): RedirectResponse
    {
        Auth::logout();
        return redirect('/');
    }
}
