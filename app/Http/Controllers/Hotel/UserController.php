<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Hotel/User/Index', [
      'filters' => Request::all('search', 'trashed'),
      'users' => User::orderBy('id')
      ->paginate(Request::get('per_page') ?? 10)
      ->withQueryString()
      ->through(function ($user) {
        return [
          'id' => $user->id,
          'name' => $user->name,
          'email' => $user->email,
          'role' => empty($user->getRoleNames()->toArray()) ? null : $user->getRoleNames()->toArray()[0],
          'photo' => $user->photo,
          'gender' => $user->gender,
          'active' => $user->active,
        ];
      })]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreUserRequest $request)
  {
    $data = $request->validated();
    $data['password'] = bcrypt($data['password']);
    $user = User::create($data);
    $user->assignRole($request->role);
    return redirect()
      ->route('hotel.users.index')
      ->withSuccess("{$user->name} kullanıcısı oluşturuldu!");
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Hotel/User/Create', [
      'roles' => Role::orderBy('id')
        ->where('name', '!=', 'Super Admin')
        ->get(['id', 'name']),
    ]);
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(User $user)
  {
    return Inertia::render('Hotel/User/Edit',[
      'user' => collect($user)->forget(['email_verified_at', 'created_at', 'updated_at', 'deleted_at'])->toArray(),
      'user_role' => $user->getRoleNames()->toArray()[0],
      'roles' => Role::orderBy('name')
        ->get(['id', 'name']),
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateUserRequest $request, User $user)
  {
    $data = $request->validated();
    if ($request->has('password_change') && (int) $request->password_change) {
      $data['password'] = bcrypt($data['password']);
    } else {
      unset($data['password']);
    }
    $user->fill($data);
    if ($user->isDirty('email')) {
      $request->user()->email_verified_at = null;
    }

    $user->update($user->getDirty());
    $user->syncRoles((int) $request->role);

    return redirect()
      ->route('hotel.users.index')
      ->withSuccess("{$user->name} kullanıcısı güncellendi!");
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(User $user)
  {
    $user->delete();
    return redirect()
      ->route('hotel.users.index')
      ->withSuccess("{$user->name} kullanıcısı silindi!");
  }
}
