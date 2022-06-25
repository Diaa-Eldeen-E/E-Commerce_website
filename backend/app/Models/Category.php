<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function ancestors()
    {
        $ancestors = $this->where('id', '=', $this->parent_id)->get();

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

    public function descendants()
    {
        $descendants = Category::where('parent_id', $this->id)->get();

        $count = $descendants->count();

        $dd = $descendants;
        while ($count != 0) {
            $arr = [];
//             only add the new decs
            foreach ($dd as $descendant) {
                array_push($arr, $descendant->id);
            }

            $dd = Category::whereIn('parent_id', $arr)->get();
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
