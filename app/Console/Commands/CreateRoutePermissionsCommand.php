<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;
use App\Models\Tenant;
class CreateRoutePermissionsCommand extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'permission:generate-permissions';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Create a permission routes.';

	/**
	 * Execute the console command.
	 */
	public function handle(): void
	{
		$routes = Route::getRoutes()->getRoutes();
		foreach ($routes as $route) {
			if (Arr::has($route->getAction(), 'middleware')) {
				if (Arr::has($route->getAction()['middleware'], 2)) {
					if ($route->getName() != ''
						&& $route->getAction()['middleware'][0] === 'web'
						&& $route->getAction()['middleware'][1] === 'Stancl\Tenancy\Middleware\InitializeTenancyByDomain'
						&& $route->getAction()['middleware'][2] === 'Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains') {
						Tenant::all()->runForEach(function () use ($route) {
							$permission = Permission::where('name', $route->getName())->first();
							if (is_null($permission)) {
								$this->info('Creating permission route ' . $route->getName());
								Permission::create(['name' => $route->getName()]);
							}
						});
					}
				}

			} else {
				$this->info('Route ' . $route->getName() . ' does not have middleware.');
			}
		}

		$this->info('Permission routes added successfully.');
	}
}
