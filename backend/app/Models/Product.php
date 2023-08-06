<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Illuminate\Support\Str;


class Product extends Model
{
    use HasFactory;

    public static function boot()
    {
        parent::boot();

        // [creat]-ing fires before any changes to the model are persisted, 
        // while [creat]-ed fires after the changes to the model are persisted.
        self::creating(function (Product $product) {
            // generate a URL friendly "slug" from the given string
            $product->slug = Str::slug($product->name, '-');
        });

        self::updating(function (Product $product) {
            $product->slug = Str::slug($product->name, '-');
        });

        // we could have used one method on event (saving) that fires when a model is either created or updated 

    }

    // Return the product's category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Return the product's reviews from all users
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }


    // Register a model observer that will automatically keep the products model in sync with the search driver
    use Searchable;


    // Configure Scout to search products by name
    public function toSearchableArray()
    {
        $array = $this->toArray();

        // Customize the data array...
        $name_array = [];
        foreach ($array as $a => $a_value) {
            if ($a == 'name')
                array_push($name_array, $a_value);
        }


        return $name_array; // Search on names only
    }
}
