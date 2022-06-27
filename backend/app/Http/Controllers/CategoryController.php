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
        $parent_name = $request->parent;
        $validator = Validator::make($request->all(), [
            'name' => 'required|alpha_dash|unique:categories,name',
            'parent' => 'nullable|alpha_dash|exists:categories,name'
        ]);


        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {


            $cat = new Category;
            $cat->name = $request->name;
            if ($request->parent) {
                $parent = Category::where('name', $parent_name)->first();
                $cat->parent_id = $parent->id;
            }
            $cat->save();

            $cat = Category::where('name', $cat->name)->first();

            return response()->json([
                'status' => 200,
                'category' => $cat,
                'message' => 'Category added successfully'
            ]);
        }

    }

    public function deleteCategory(Request $request)
    {
        $catName = $request->keys();

        // Validate input
        $validator = Validator::make(['catName' => $catName], [
            'catName' => 'required|alpha_dash|exists:categories,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {

            $category = Category::where('name', $catName)->get();
            $deleted = $category->delete();
            if ($deleted)
                return response()->json([
                    'status' => 200,
                    'message' => 'Deleted:' . $deleted
                ]);
            else
                return response()->json('Not deleted');
        }
    }

    public function updateCategory(Request $request, $catName)
    {
        // Validate input, (No duplicate name, parent must exist)
        $parent_name = $request->parent;

        $validator = Validator::make($request->all() + ['catName' => $catName], [
            'name' => 'required|alpha_dash|unique:categories,name',
            'catName' => 'required|alpha_dash|exists:categories,name',
            'parent' => 'nullable|alpha_dash|exists:categories,name'
        ]);


        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        } else {

            $category = Category::where('name', $catName)->first();

            $category->name = $request->name;
            if ($request->parent) {
                $parent = Category::where('name', $parent_name)->first();
                $category->parent_id = $parent->id;
            } else
                $category->parent_id = NULL;
            $category->save();

            $cat = Category::where('name', $category->name)->first();

            return response()->json([
                'status' => 200,
                'category' => $cat,
                'message' => 'Category updated successfully'
            ]);
        }
    }
}
