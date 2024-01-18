<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\TenantCollection;

/**
 * App\Models\Tenant
 *
 * @property string $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property array|null $data
 * @property-read Collection<int, Domain> $domains
 * @property-read int|null $domains_count
 * @method static TenantCollection<int, static> all($columns = ['*'])
 * @method static TenantCollection<int, static> get($columns = ['*'])
 * @method static Builder|Tenant newModelQuery()
 * @method static Builder|Tenant newQuery()
 * @method static Builder|Tenant query()
 * @method static Builder|Tenant whereCreatedAt($value)
 * @method static Builder|Tenant whereData($value)
 * @method static Builder|Tenant whereId($value)
 * @method static Builder|Tenant whereUpdatedAt($value)
// * @method static \Stance\Tenancy\Database\TenantCollection<int, static> all($columns = ['*'])
// * @method static \Stancl\Tenancy\Database\TenantCollection<int, static> get($columns = ['*'])
// * @method static \Stancl\Tenancy\Database\TenantCollection<int, static> all($columns = ['*'])
// * @method static \Stancl\Tenancy\Database\TenantCollection<int, static> get($columns = ['*'])
 * @mixin Eloquent
 */

class Tenant extends BaseTenant implements TenantWithDatabase
{
	use HasDatabase, HasDomains;
}
