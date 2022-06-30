<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // Return cart items (in cart_items table)
    public function items()
    {
        return $this->hasMany(Cart_item::class);
    }

    // Return cart products
    public function products()
    {
        return $this->belongsToMany(Product::class, 'cart_items')->withPivot('quantity')
            ->withTimestamps();

        // cart_items: The intermediate table in the many-to-many relationship
        // withPivot: Extra attributes to be accessed in the intermediate table
        // withTimestamps: automatically maintain the created_at and updated_at timestamps in the intermediate table
    }
}
