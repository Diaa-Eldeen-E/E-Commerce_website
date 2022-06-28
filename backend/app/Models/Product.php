<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory;

    // Register a model observer that will automatically keep the products model in sync with the search driver
    use Searchable;


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
