<?php

namespace App\Http\Controllers;

use App\Models\Cart_item;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\Wishlist;
use App\Models\Wishlist_item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function searchProducts(Request $request)
    {
        $query = $request->query('q');
        $startIdx = $request->query('s_idx');
        $endIdx = $request->query('e_idx');

        // Validate input
        $validator = Validator::make(['query' => $query, 's_idx' => $startIdx, 'e_idx' => $endIdx], [
            'query' => 'required|generic_name|max:255',
            's_idx' => 'required|integer|min:0',
            'e_idx' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        $query = str_replace(' ', '%', $query);

        // Search in products table
        $results = DB::table('products')->where('name', 'like', '%' . $query . '%')
            ->offset($startIdx)->limit($endIdx - $startIdx)->get();
        $totalCount = DB::table('products')->where('name', 'like', '%' . $query . '%')
            ->count();


        return response()->json([
            'status' => 200,
            'results' => $results,
            'totalCount' => $totalCount
        ]);
    }

    //
    public function addProduct(Request $request)
    {
        // Validate input, (No duplicate name, category must exist)
        $validator = Validator::make($request->all(), [
            'name' => 'required|generic_name|unique:products,name',
            'category_name' => 'required|generic_name|exists:categories,name',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {

            $product = new Product;
            $product->name = $request->name;
            $product->category_id = Category::where('name', $request->category_name)->first()->id;
            if ($request->image_src)
                $product->image_src = $request->image_src;

            $product->description = $request->description;
            $product->price = $request->price;
            $product->stock = $request->stock;
            $product->save();

            $prod = Product::where('name', $product->name)->first();

            return response()->json([
                'status' => 200,
                'product' => $prod,
                'message' => 'Product added successfully'
            ]);
        }

    }

    public function getProducts(Request $request)
    {
        $catName = $request->query('cat_name');
        $startIdx = $request->query('s_idx');
        $endIdx = $request->query('e_idx');

        // Validate input, (No duplicate name, category must exist)
        $validator = Validator::make(['cat_name' => $catName, 's_idx' => $startIdx, 'e_idx' => $endIdx], [
            'cat_name' => 'required|generic_name|exists:categories,name',
            's_idx' => 'required|integer|min:0',
            'e_idx' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {
            $category = Category::where('name', $catName)->first();

            $cats = $category->descendants;

            $idArr = [$category->id];
            foreach ($cats as $cat) {
                array_push($idArr, $cat->id);
            }

            $products = Product::whereIn('category_id', $idArr)
                ->offset($startIdx)->limit($endIdx - $startIdx)->get();

            $totalProductsCount = DB::table('products')->whereIn('category_id', $idArr)->count('id');

            foreach ($products as $product) {
                $product->rating = $product->reviews()->sum('rating');
                $product->raters_count = $product->reviews()->count();
            }

            return response()->json([
                'status' => 200,
                'products' => $products,
                'totalProductsCount' => $totalProductsCount,
                'message' => 'Products retrieved'
            ]);
        }

    }

    public function getProduct(Request $request)
    {

        $productID = $request->query('q');


        // Validate input
        $validator = Validator::make(['product_id' => $productID], [
            'product_id' => 'required|integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {

            $product = Product::where('id', $productID)->first();

            $product->rating = $product->reviews()->sum('rating');
            $product->raters_count = $product->reviews()->count();
            $product->reviews = $product->reviews()->get();

            return response()->json([
                'status' => 200,
                'product' => $product,
                'message' => 'Product retrieved'
            ]);
        }
    }

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
            ]);
        }

        // Add the product to this user's wishlist
        $wishlist_item = new Wishlist_item;
        $wishlist_item->product_id = $request->product_id;

        $request->user()->wishlist()->first()->items()->save($wishlist_item);
//        $wishlist_item->wishlist_id = $request->user()->wishlist_id;
//        $wishlist_item->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product added to wishlist successfully'
        ]);
    }

    public function removeFromWishlist(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:wishlist_items,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        // Remove the product from the user's wishlist
        $deleted = $request->user()->wishlist()->first()->items()
            ->where('product_id', $request->product_id)->delete();


        if ($deleted)
            return response()->json([
                'status' => 200,
                'message' => 'Product removed from wishlist'
            ]);
        else
            return response()->json(['Failed to delete'], 500);
    }

    public function addToCart(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }
        $product = Product::where('id', $request->product_id)->first();
        if ($request->quantity > $product->stock)
            return response()->json(['The requested quantity is unavailable'], 400);

        // Add the product to this user's cart
        $prevCartItem = $request->user()->cart()->first()->items()
            ->where('product_id', $request->product_id)->first();

        // Already in cart?
        if ($prevCartItem) {
            // Add this quantity to the previous quantity if available
            if ($request->quantity + $prevCartItem->quantity > $product->stock)
                return response()->json(['The requested quantity is unavailable'], 400);
            else {
                $prevCartItem->quantity += $request->quantity;
                $prevCartItem->save();
            }
        } // Not previously carted -> Create a new cart item
        else {
            $cart_item = new Cart_item([
                'product_id' => $request->product_id,
                'cart_id' => $request->user()->cart()->first()->id,
                'quantity' => $request->quantity
            ]);
            $cart_item->save();

//            $request->user()->cart()->first()->products()
//                ->attach($request->product_id, ['quantity' => $request->quantity]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Items added to cart successfully'
        ]);
    }

    public function removeFromCart(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:cart_items,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        // Remove the product from the user's wishlist
        $deleted = $request->user()->cart()->first()->items()
            ->where('product_id', $request->product_id)->delete();

        if ($deleted)
            return response()->json([
                'status' => 200,
                'message' => 'Product removed from cart'
            ]);
        else
            return response()->json(['Failed to delete'], 500);
    }

    public function isListed(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        $count = $request->user()->wishlist()->first()->items()->where('product_id', $request->product_id)->count();

        return response()->json([
            'islisted' => $count > 0
        ]);
    }

    public function isCarted(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        $item = $request->user()->cart()->first()->items()->where('product_id', $request->product_id)->first();

        if ($item)
            return response()->json([
                'iscarted' => 1,
                'quantity' => $item->quantity,
            ]);
        else
            return response()->json([
                'iscarted' => 0,
            ]);
    }

    public function getWishlist(Request $request)
    {
        return response()->json([
            'status' => 200,
            'products' => $request->user()->wishlist()->first()->products()->get(),
            'message' => 'Products retrieved'
        ]);
    }

    public function getCart(Request $request)
    {
        return response()->json([
            'status' => 200,
            'products' => $request->user()->cart()->first()->products()->get(),
            'message' => 'Products retrieved'
        ]);
    }

    public function getReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        $review = $request->user()->reviews()->where('product_id', $request->product_id)->first();

        return response()->json([
            'review' => $review
        ]);
    }

    public function addReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|min:0',
            'rating' => 'required|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        $review = Review::create([
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'description' => $request->description ? $request->description : NULL,
            'user_id' => $request->user()->id
        ]);


        return response()->json([
            'status' => 200,
            'message' => 'Review added successfully',
            'review' => $review
        ]);
    }
}
