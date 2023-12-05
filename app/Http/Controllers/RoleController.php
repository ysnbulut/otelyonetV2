<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Role/Index', [
      'roles' => Role::orderBy('id')
        ->select(['id', 'name', 'guard_name'])
        ->paginate(Request::get('per_page') ?? 10)
        ->withQueryString()
        ->through(function ($role) {
          return [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'permissions' => $role->permissions()->pluck('name')->join(', ') ?? null,
          ];
        }),
      'can' => [
        'create' => auth()
          ->user()
          ->can('hotel.roles.create'),
        'edit' => auth()
          ->user()
          ->can('hotel.roles.edit'),
        'delete' => auth()
          ->user()
          ->can('hotel.roles.destroy'),
      ],
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreRoleRequest $request)
  {
    $role = Role::create($request->validated());
    $role->syncPermissions($request->permissions);
    $dashboardIndex = Permission::where('name', 'hotel.dashboard.index')->first();
    if (!$role->hasPermissionTo($dashboardIndex)) {
      $role->givePermissionTo($dashboardIndex);
    }
    return redirect()->route('hotel.roles.index')->with('success', "{$role->name} Rolü Oluşturuldu!");
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Role/Create', [
      'permissions' => Permission::orderBy('name', 'asc')
        ->whereNotIn('name', [
          'sanctum . csrf - cookie',
          'dark - mode - switcher',
          'login . index',
          'login . check',
          'logout',
          'dashboard . index',
        ])
        ->get(['id', 'name'])
        ->toArray(),
    ]);
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
    $rolePermissions = $role->permissions->pluck('name')->toArray();
    return Inertia::render( 'Role/Edit',[
      'role' => $role->only(['id', 'name', 'guard_name']),
      'rolePermissions' => $rolePermissions,
      'permissions' => Permission::orderBy('name', 'asc')
        ->whereNotIn('name', [
          'sanctum . csrf - cookie',
          'dark - mode - switcher',
          'login . index',
          'login . check',
          'logout',
          'dashboard . index',
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
    $dashboardIndex = Permission::where('name', 'hotel.dashboard.index')->first();
    $role->syncPermissions($request->permissions);
    if (!$role->hasPermissionTo($dashboardIndex)) {
      $role->givePermissionTo($dashboardIndex);
    }
    return Redirect::back()->with('success', "{$role->name} Rolü güncellendi!");
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Role $role)
  {
    if ($role->name === 'Super Admin') {
      return redirect()
        ->route('hotel . roles . index')
        ->withErrors('Super Admin silinemez!');
    }
    $role->delete();
    return Redirect::to(route('hotel.roles.index'))->with('success', "{$role->name} Rolü silindi!");
  }
}
