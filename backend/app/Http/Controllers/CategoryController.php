<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Contracts\Support\MessageBag;
use Illuminate\Contracts\Support\MessageProvider;
use Illuminate\Http\Request;
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
            ]);
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
            ]);
        }

        $deleted = Category::where('id', $category_id)->delete();

        if ($deleted)
            return response()->json([
                'status' => 200,
                'deleted' => $deleted,
                'message' => 'Deleted items successfully'
            ]);
        else
            return response()->json('Not deleted');

    }

    public function updateCategory(Request $request, $category_id)
    {
        // Validate input
        $validator = Validator::make(['category_id' => $category_id], [
            'category_id' => 'required|numeric|min:0|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        // Delete old one, then insert the updated one
        Category::where('id', $category_id)->delete();

        $validator = Validator::make($request->all(), [
            'name' => 'required|generic_name|unique:categories,name',
            'parent_id' => 'nullable|numeric|min:0|exists:categories,id'
        ]);

        $category = new Category;
        $category->id = $category_id;
        $category->name = $request->name;

        if ($request->has('parent_id')) {
            $category->parent_id = $request->parent_id;
        }

        $category->save();
        $category->refresh();

        return response()->json([
            'status' => 200,
            'category' => $category,
            'message' => 'Category updated successfully'
        ]);
    }

}
