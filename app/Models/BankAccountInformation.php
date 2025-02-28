<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BankAccountInformation
 *
 * @method static Builder|BankAccountInformation newModelQuery()
 * @method static Builder|BankAccountInformation newQuery()
 * @method static Builder|BankAccountInformation query()
 * @method static Builder|BankAccountInformation onlyTrashed()
 * @method static Builder|BankAccountInformation withTrashed()
 * @method static Builder|BankAccountInformation withoutTrashed()
 * @mixin Eloquent
 */
class BankAccountInformation extends Model
{
    use SoftDeletes;
}
