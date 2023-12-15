<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Wishlist_item;


class WishlistController extends Controller
{
    //
    public function addToWishlist(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Add the product to this user's wishlist
        $wishlist_item = new Wishlist_item;
        $wishlist_item->product_id = $request->product_id;

        $request->user()->wishlist()->first()->items()->save($wishlist_item);
        //        $wishlist_item->wishlist_id = $request->user()->wishlist_id;
        //        $wishlist_item->save();

        return response()->json([
            'message' => 'Product added to wishlist successfully'
        ]);
    }

    public function removeFromWishlist(Request $request, $product_id)
    {
        // Validate input
        $validator = Validator::make(array_merge($request->all(), ['product_id' => $product_id]), [
            'product_id' => 'required|integer|exists:wishlist_items,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Remove the product from the user's wishlist
        $deleted = $request->user()->wishlist()->first()->items()
            ->where('product_id', $request->product_id)->delete();


        if ($deleted)
            return response()->json([
                'message' => 'Product removed from wishlist successfully'
            ]);
        else
            return response()->json(['Failed to delete'], 500);
    }

    public function isListed(Request $request, $product_id)
    {
        $validator = Validator::make(['product_id' => $product_id], [
            'product_id' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $item = $request->user()->wishlist()->first()->items()->where('product_id', $request->product_id)->first();

        return response()->json([
            'islisted' => $item ? 1 : 0
        ]);
    }

    public function getWishlist(Request $request)
    {
        return response()->json($request->user()->wishlist()->first()->products()->get());
    }
}
