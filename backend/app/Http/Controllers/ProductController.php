<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function searchProducts(Request $request)
    {
        $query = $request->query('q');

        // Validate input
        $validator = Validator::make($request->all(), [
            'q' => 'generic_name|max:255',  // Query
            'category' => 'numeric|min:0|exists:categories,id',
            'page' => 'integer|min:0',
            'size' => 'integer|min:0',
            'min_price' => 'integer|min:0',
            'max_price' => 'integer|gt:min_price',
        ]);

        $page_num = $request->page ? $request->page : 1;
        $page_size = $request->size ? $request->size : 10;
        $min_price = $request->min_price ? $request->min_price : 0;
        $max_price = $request->max_price ? $request->max_price : PHP_INT_MAX;

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $query = str_replace(' ', '%', $query);

        // Searching inside a particular category
        if ($request->category) {

            $category = Category::where('id', $request->category)->first();

            // Include all descendant categories
            $cats = $category->descendants;
            $idArr = [$category->id];
            foreach ($cats as $cat) {
                array_push($idArr, $cat->id);
            }

            $results = DB::table('products')->where('name', 'like', '%' . $query . '%')
                ->whereIn('category_id', $idArr)
                ->whereBetween('price', [$min_price, $max_price])->paginate($page_size);
        }
        // Searching inside all products
        else
            $results = DB::table('products')->where('name', 'like', '%' . $query . '%')
                ->whereBetween('price', [$min_price, $max_price])->paginate($page_size);

        return response()->json($results);
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
            ], Response::HTTP_CREATED);
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
            'product' => $product,
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
            return response('', Response::HTTP_NO_CONTENT);
        else
            return response('Not deleted', Reseponse::HTTP_BAD_REQUEST);
    }

    public function getProducts(Request $request, $category_id)
    {
        // Validate input
        $validator = Validator::make(array_merge($request->all(), ['category_id' => $category_id]), [
            'category_id' => 'required|numeric|min:0|exists:categories,id',
            'page' => 'integer|min:0',
            'size' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $page_num = $request->page ? $request->page : 1;
        $page_size = $request->size ? $request->size : 10;

        // Include all descendant categories
        $category = Category::where('id', $request->category_id)->first();
        $cats = $category->descendants;
        $idArr = [$category->id];
        foreach ($cats as $cat) {
            array_push($idArr, $cat->id);
        }

        // $products = Product::whereIn('category_id', $idArr)
        //     ->offset($startIdx)->limit($endIdx - $startIdx)->get();

        $products = Product::whereIn('category_id', $idArr)->paginate($page_size);

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

            $product->raters_count = $product->reviews()->count();
            $product->reviews = $product->reviews()->get();
            $product->parentCategories = $product->category->ancestors;

            return response()->json($product);
        }
    }

    public function getUserReview(Request $request, $product_id)
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
        }

        $review = $request->user()->reviews()->where('product_id', $request->product_id)->first();

        return response()->json($review);
    }

    public function addReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => [
                'required',
                'integer',
                'min:0',
                // The same user cannot rate the same product twice
                Rule::unique('reviews')->where(fn (Builder $query) => $query->where('user_id', $request->user()->id))
            ],
            'rating' => 'required|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        // The review model automatically updates the product rating
        $review = Review::create([
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'description' => $request->description ? $request->description : NULL,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'status' => 200,
            'review' => $review,
            'message' => 'Review created successfully'
        ], Response::HTTP_CREATED);
    }
}
