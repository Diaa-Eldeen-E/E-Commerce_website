<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist_item extends Model
{
    use HasFactory;

    // Attributes that can be passed as array in the create function
    protected $fillable = [
        'product_id',
        'cart_id'
    ];
}
