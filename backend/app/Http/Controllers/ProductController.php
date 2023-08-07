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
use Illuminate\Http\Response;
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
            ], Response::HTTP_BAD_REQUEST);
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
            'category' => 'required|numeric|min:0|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        } else {

            $product = new Product;
            $product->name = $request->name;
            $product->category_id = $request->category;
            if ($request->image_src)
                $product->image_src = $request->image_src;

            $product->description = $request->description;
            $product->price = $request->price;
            $product->stock = $request->stock;
            $product->save();

            $product->refresh();

            return response()->json([
                'status' => 200,
                'product' => $product,
                'message' => 'Product added successfully'
            ]);
        }
    }

    public function updateProduct(Request $request, $product_id)
    {
        // Validate input, (No duplicate name, parent must exist)

        $validator = Validator::make($request->all() + ['product_id' => $product_id], [
            'product_id' => 'required|generic_name|exists:products,id',
            'name' => 'generic_name|max:255',
            'category_name' => 'max:255|generic_name|exists:categories,name',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $product = Product::where('id', $product_id)->first();

        if ($request->has('name'))
            $product->name = $request->name;

        if ($request->has('category_name'))
            $product->category_id = Category::where('name', $request->category_name)->first()->id;

        if ($request->has('price'))
            $product->price = $request->price;

        if ($request->has('stock'))
            $product->stock = $request->stock;

        $product->save();


        return response()->json([
            'status' => 200,
            'category' => $product,
            'message' => 'Product updated successfully'
        ]);
    }

    public function deleteProduct(Request $request, $product_id)
    {
        $validator = Validator::make(
            ['product_id' => $product_id],
            [
                'product_id' => 'required|generic_name|exists:products,id',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $deleted = Product::where('id', $product_id)->delete();

        if ($deleted)
            return response()->json([
                'status' => 200,
                'deleted' => $deleted,
                'message' => 'Deleted items successfully'
            ]);
        else
            return response()->json('Not deleted');
    }

    public function getProducts(Request $request, $category_id)
    {
        // Validate input
        $validator = Validator::make(array_merge($request->all(), ['category_id' => $category_id]), [
            'category_id' => 'required|numeric|min:0|exists:categories,id',
            // 's_idx' => 'required|integer|min:0',
            // 'e_idx' => 'required|integer|min:0',
            'page' => 'integer|min:0',
            'size' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }
        // $startIdx = $request->s_idx;
        // $endIdx = $request->e_idx;

        $page_num = $request->page ? $request->page : 1;
        $page_size = $request->size ? $request->size : 10;

        $category = Category::where('id', $request->category_id)->first();

        $cats = $category->descendants;

        $idArr = [$category->id];
        foreach ($cats as $cat) {
            array_push($idArr, $cat->id);
        }

        // $products = Product::whereIn('category_id', $idArr)
        //     ->offset($startIdx)->limit($endIdx - $startIdx)->get();

        $products = Product::whereIn('category_id', $idArr)->paginate($page_size);

        // $totalProductsCount = DB::table('products')->whereIn('category_id', $idArr)->count('id');

        foreach ($products as $product) {
            $product->rating = $product->reviews()->sum('rating');
            $product->raters_count = $product->reviews()->count();
        }

        return response()->json($products);
    }

    public function getProduct(Request $request, $product_id)
    {
        // Validate input
        $validator = Validator::make(['product_id' => $product_id], [
            'product_id' => 'required|integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        } else {

            $product = Product::where('id', $request->product_id)->first();

            $product->rating = $product->reviews()->sum('rating');
            $product->raters_count = $product->reviews()->count();
            $product->reviews = $product->reviews()->get();

            $product->parentCategories = $product->category->ancestors;

            return response()->json($product);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
            ], Response::HTTP_BAD_REQUEST);
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
