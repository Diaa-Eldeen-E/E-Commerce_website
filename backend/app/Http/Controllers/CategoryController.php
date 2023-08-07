<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Contracts\Support\MessageBag;
use Illuminate\Contracts\Support\MessageProvider;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    //
    public function getNestedCategories(Request $request)
    {
        // Return categories in nested form
        $rootCats = Category::where('parent_id', NULL)->orderBy('name', 'asc')->get();
        function rec_cat($parents)
        {
            foreach ($parents as $parent) {
                $parent->children = Category::where('parent_id', $parent->id)->orderBy('name', 'asc')->get();
                if ($parent->children->count() > 0)
                    rec_cat($parent->children);
            }
        }

        rec_cat($rootCats);
        return response()->json($rootCats);
    }

    public function getCategories(Request $request)
    {
        $categories = DB::table('categories')->orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    public function getCategory(Request $request, $category_id)
    {
        // Validate input
        $validator = Validator::make(['category_id' => $category_id], [
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        } else {

            $category = Category::where('id', $category_id)->first();

            // [Todo:] Return category parent and children with it

            return response()->json($category);
        }
    }

    public function addCategory(Request $request)
    {
        // Validate input, (No duplicate name, parent must exist)
        $validator = Validator::make($request->all(), [
            'name' => 'required|generic_name|unique:categories,name',
            'parent_id' => 'nullable|numeric|min:0|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }


        $category = new Category;
        $category->name = $request->name;
        if ($request->has('parent_id')) {
            $category->parent_id = $request->parent_id;
        }
        $category->save();

        $category->refresh();

        return response()->json([
            'status' => 200,
            'category' => $category,
            'message' => 'Category added successfully'
        ]);
    }

    public function deleteCategory(Request $request, $category_id)
    {

        // Validate input
        $validator = Validator::make(['category_id' => $category_id], [
            'category_id' => 'required|numeric|min:0|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $deleted = Category::where('id', $category_id)->delete();

        if ($deleted)
            return response()->json([
                'status' => 200,
                'deleted' => $deleted,
                'message' => 'Deleted items successfully'
            ]);
        else
            return response()->json('Not deleted', Response::HTTP_BAD_REQUEST);
    }

    public function updateCategory(Request $request, $category_id)
    {
        // Validate input
        $validator = Validator::make(array_merge($request->all(), ['category_id' => $category_id]), [
            'category_id' => 'required|numeric|min:0|exists:categories,id',
            'name' => 'required|generic_name|unique:categories,name',
            'parent_id' => 'nullable|numeric|min:0|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $category = Category::where('id', $category_id)->first();

        $category->name = $request->name;

        if ($request->has('parent_id')) {
            $category->parent_id = $request->parent_id;
        } else
            $category->parent_id = NULL;

        $category->save();
        $category->refresh();

        return response()->json([
            'status' => 200,
            'category' => $category,
            'message' => 'Category updated successfully'
        ]);
    }
}
