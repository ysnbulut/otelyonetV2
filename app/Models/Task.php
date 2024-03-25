<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Task
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder|Task onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Task withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Task withoutTrashed()
 * @mixin \Eloquent
 */
class Task extends Model
{
    use softDeletes;
}
