<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
  $roles = Role::orderBy('id')
   ->select(['id', 'name', 'guard_name'])
   ->paginate(10)
   ->withQueryString()
   ->through(function ($role) {
    return [
     'id' => $role->id,
     'name' => $role->name,
     'guard_name' => $role->guard_name,
    ];
   });
  return view('hotel.pages.roles.index', [
   'roles' => $roles,
  ]);
 }

 /**
  * Show the form for creating a new resource.
  */
 public function create()
 {
  return view('hotel.pages.roles.create', [
   'permissions' => Permission::orderBy('name', 'asc')
    ->whereNotIn('name', [
     'sanctum.csrf-cookie',
     'dark-mode-switcher',
     'login.index',
     'login.check',
     'logout',
     'dashboard.index',
    ])
    ->get(['id', 'name'])
    ->toArray(),
  ]);
 }

 /**
  * Store a newly created resource in storage.
  */
 public function store(StoreRoleRequest $request)
 {
  $role = Role::create($request->validated());
  $role->syncPermissions($request->permissions);
  $dashboardIndex = Permission::where('name', 'dashboard.index')->first();
  if (!$role->hasPermissionTo($dashboardIndex)) {
   $role->givePermissionTo($dashboardIndex);
  }
  return redirect()
   ->route('hotel.roles.index')
   ->withSuccess("{$role->name} Rolü oluşturuldu!");
 }

 /**
  * Display the specified resource.
  */
 public function show(Role $role)
 {
  //$users = $role
  //	->users()
  //	->orderBy('name')
  //	->paginate(10)
  //	->withQueryString()
  //	->through(function ($user) {
  //		return [
  //			'id' => $user->id,
  //			'name' => $user->name,
  //		];
  //	});

  //$permissions = $permissions
  //	->orderBy('name')
  //	->withQueryString()
  //	->through(function ($permission) {
  //		return [
  //			'id' => $permission->id,
  //			'name' => $permission->name,
  //		];
  //	});
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(Role $role)
 {
  if ($role->name === 'Super Admin') {
   return redirect()
    ->route('hotel.roles.index')
    ->withErrors('Super Admin değiştirilemez!');
  }
  $rolePermissions = $role->permissions->pluck('id')->toArray();
  return view('hotel.pages.roles.edit', [
   'role' => $role,
   'rolePermissions' => $rolePermissions,
   'permissions' => Permission::orderBy('name', 'asc')
    ->whereNotIn('name', [
     'sanctum.csrf-cookie',
     'dark-mode-switcher',
     'login.index',
     'login.check',
     'logout',
     'dashboard.index',
    ])
    ->get(['id', 'name'])
    ->toArray(),
  ]);
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdateRoleRequest $request, Role $role)
 {
  if ($role->name === 'Super Admin') {
   return redirect()
    ->route('hotel.roles.index')
    ->withErrors('Super Admin değiştirilemez!');
  }
  $role->update($request->validated());
  $dashboardIndex = Permission::where('name', 'dashboard.index')->first();
  $role->syncPermissions($request->permissions);
  if (!$role->hasPermissionTo($dashboardIndex)) {
   $role->givePermissionTo($dashboardIndex);
  }
  return redirect()
   ->route('hotel.roles.index')
   ->withSuccess("{$role->name} Rolü güncellendi!");
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy(Role $role)
 {
  if ($role->name === 'Super Admin') {
   return redirect()
    ->route('hotel.roles.index')
    ->withErrors('Super Admin silinemez!');
  }
  $role->delete();
  return redirect()
   ->route('hotel.roles.index')
   ->withSuccess("{$role->name} Rolü silindi!");
 }
}
