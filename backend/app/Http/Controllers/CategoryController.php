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
    public function categories(Request $request)
    {
//        $min_id = DB::table('categories')->min('id');
//        $cats = DB::table('categories')->select(DB::raw('id - ' . ($min_id - 1) . ' as id, name,
//        COALESCE(parent_id - ' .
//            ($min_id - 1) . ' , 0) as parent_id'))->get();
//        $cats = Category::whereNull('parent_id')->get();
        $cats = DB::table('categories')->orderBy('name', 'asc')->get();
        return response()->json($cats);
    }

    public function addCategory(Request $request)
    {
        // Validate input, (No duplicate name, parent must exist)
        $parent_name = $request->parent;
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories,name',
            'parent' => 'nullable|exists:categories,name'
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

        $category = Category::where('name', $catName)->get();
        if ($category->count() == 1) {
            $deleted = Category::where('name', $catName)->delete();
            if ($deleted)
                return response()->json([
                    'status' => 200,
                    'message' => 'Deleted:' . $deleted
                ]);
            else
                return response()->json('Not deleted');

        } else
            return response()->json('Error during deletion');
    }

    public function updateCategory(Request $request, $catName)
    {


        // Validate input, (No duplicate name, parent must exist)
        $parent_name = $request->parent;

        $validator = Validator::make($request->all() + ['catName' => $catName], [
            'name' => 'required|unique:categories,name',
            'catName' => 'required|exists:categories,name',
            'parent' => 'nullable|exists:categories,name'
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

        return response()->json($catName);
    }
}
