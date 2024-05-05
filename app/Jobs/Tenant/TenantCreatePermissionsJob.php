<?php

namespace App\Jobs\Tenant;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;

class TenantCreatePermissionsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public Tenant $tenant;

    public int $uniqueFor = 900;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function uniqueId(): string
    {
        return $this->tenant->id;
    }


    public function handle(): void
    {
        $this->tenant->run(function () {
            $routes = Route::getRoutes()->getRoutes();
            foreach ($routes as $route) {
                if (Arr::has($route->getAction(), 'middleware')) {
                    if (Arr::has($route->getAction()['middleware'], 2)) {
                        if ($route->getName() != ''
                            && $route->getAction()['middleware'][0] === 'web'
                            && $route->getAction()['middleware'][1] === 'Stancl\Tenancy\Middleware\InitializeTenancyByDomain'
                            && $route->getAction()['middleware'][2] === 'Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains') {
                            $permission = Permission::where('name', $route->getName())->first();
                            if (is_null($permission)) {
                                Permission::create(['name' => $route->getName()]);
                            }
                        }
                    }

                }
            }
        });
    }
}
