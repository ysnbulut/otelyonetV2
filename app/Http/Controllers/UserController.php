<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
  $users = User::orderBy('id')
   ->paginate(10)
   ->withQueryString()
   ->through(function ($user) {
    return [
     'id' => $user->id,
     'name' => $user->name,
     'email' => $user->guard_name,
     'role' => empty($user->getRoleNames()->toArray()) ? null : $user->getRoleNames()->toArray()[0],
     'photo' => $user->photo,
     'gender' => $user->gender,
     'active' => $user->active,
    ];
   });
  return view('hotel.pages.users.index', ['users' => $users]);
 }

 /**
  * Show the form for creating a new resource.
  */
 public function create()
 {
  return view('hotel.pages.users.create', [
   'roles' => Role::orderBy('id')
    ->get(['id', 'name'])
    ->where('name', '!=', 'Super Admin')
    ->toArray(),
  ]);
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
  return view('hotel.pages.users.edit', [
   'user' => $user,
   'user_role' => $user->getRoleNames()->toArray()[0],
   'roles' => Role::orderBy('id')
    ->get(['id', 'name'])
    ->where('name', '!=', 'Super Admin')
    ->toArray(),
  ]);
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdateUserRequest $request, User $user)
 {
  $data = $request->validated();
  if ($request->has('password_change')) {
   $data['password'] = bcrypt($data['password']);
  }
  $user->fill($data);
  if ($user->isDirty('email')) {
   $request->user()->email_verified_at = null;
  }

  $user->update($user->getDirty());
  $user->syncRoles($request->role);
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
