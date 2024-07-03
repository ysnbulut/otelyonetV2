<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
  {
    $role = Role::create(['name' => 'Super Admin']);
    $user = User::factory()->create(['name' => 'Admin', 'email' => 'admin@otelyonet.com', 'password' => bcrypt('admin'),]);
    $user->assignRole($role);
  }
}
