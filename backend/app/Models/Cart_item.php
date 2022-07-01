<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\CompositePrimaryKeyTrait;

class Cart_item extends Model
{
    use HasFactory;

    // Override default methods, variables to handle composite primary key
    // Ref: https://stackoverflow.com/questions/36332005/laravel-model-with-two-primary-keys-update
    use CompositePrimaryKeyTrait;

    protected $primaryKey = ['cart_id', 'product_id'];
    public $incrementing = false;

    // Attributes that can be passed as array in the create function
    protected $fillable = [
        'product_id',
        'cart_id',
        'quantity'
    ];
}
