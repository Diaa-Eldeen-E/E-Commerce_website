<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'rating',
        'description',
        'user_id'
    ];

    public static function boot()
    {
        parent::boot();

        // Update the product rating taking this review into account
        self::saved(function (Review $review) {
            $product = Product::where('id', $review->product_id)->first();
            $reviews = Review::where('product_id', $review->product_id);
            $product->rating = $reviews->sum('rating') / $reviews->count();
            $product->save();
        });
    }
}
