<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    //
    public function addProduct(Request $request)
    {
        // Validate input, (No duplicate name, category must exist)
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:products,name',
            'category_name' => 'required|exists:categories,name',
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
            'cat_name' => 'required|exists:categories,name',
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

        $productID = $request->keys();

        // Validate input
        $validator = Validator::make(['product_id' => $productID], [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {

            $product = Product::where('id', $productID)->first();

            return response()->json([
                'status' => 200,
                'product' => $product,
                'message' => 'Product retrieved'
            ]);
        }
    }
}
