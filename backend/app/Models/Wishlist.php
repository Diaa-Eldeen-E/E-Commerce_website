<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    // Return wishlist items (in wishlist_items table)
    public function items()
    {
        return $this->hasMany(Wishlist_item::class);
    }

    // Return wishlist products
    public function products()
    {
        return $this->belongsToMany(Product::class, 'wishlist_items')->withTimestamps();

        // wishlist_items: The intermediate table in the many-to-many relationship
        // withTimestamps: automatically maintain the created_at and updated_at timestamps in the intermediate table
    }
}
