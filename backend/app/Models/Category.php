<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Return category ancestors in the hierarchy
    public function ancestors()
    {
        // First parent
        $ancestors = $this->where('id', '=', $this->parent_id)->get();

        // Add parents until no more (i.e. parent = null)
        while ($ancestors->last() && $ancestors->last()->parent_id !== null) {
            $parent = $this->where('id', '=', $ancestors->last()->parent_id)->get();
            $ancestors = $ancestors->merge($parent);
        }

        return $ancestors;
    }

    public function getAncestorsAttribute()
    {
        return $this->ancestors();
    }


    // Return category children
    public function childCategories()
    {
        $children = $this->where('parent_id', $this->id)->get();
        return $children;
    }

    public function getChildCategoriesAttribute()
    {
        return $this->childCategories();
    }

    // Return all descendant categories in the hierarchy in an array form
    public function descendants()
    {
        // Get direct children
        $descendants = Category::where('parent_id', $this->id)->get();

        $count = $descendants->count();

        // Append children until we get no more children (i.e. count of 0)
        $dd = $descendants;
        while ($count != 0) {
            $id_array = [];

            // only add the new descendants (To get their direct children)
            foreach ($dd as $descendant) {
                array_push($id_array, $descendant->id);
            }

            $dd = Category::whereIn('parent_id', $id_array)->get();
            $descendants = $descendants->merge($dd);

            $count = $dd->count();
        }

        return $descendants;
    }

    public function getDescendantsAttribute()
    {
        return $this->descendants();
    }
}
