<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('product', [\App\Http\Controllers\ProductController::class, 'getProduct']);

Route::get('products', [\App\Http\Controllers\ProductController::class, 'getProducts']);

//Only admin should be able to add product
Route::post('addproduct', [\App\Http\Controllers\ProductController::class, 'addProduct']);

Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'getCategories']);
Route::get('nestedcategories', [\App\Http\Controllers\CategoryController::class, 'getNestedCategories']);

// Only admin should be able to update category
Route::put('category/{catName}', [\App\Http\Controllers\CategoryController::class, 'updateCategory']);

// Only admin should be able to add category
Route::post('category', [\App\Http\Controllers\CategoryController::class, 'addCategory']);

// Only admin should be able to delete category
Route::delete('category', [\App\Http\Controllers\CategoryController::class, 'deleteCategory']);

// Check admin authorization, (Check authentication before calling checkAuth)
Route::middleware('auth:sanctum')->get('checkAuth', [\App\Http\Controllers\AuthController::class, 'checkAuth']);

Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);

// Handle logout (Must be authenticated first)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});


//This guard will ensure that incoming requests are authenticated as either
// stateful, cookie authenticated requests or
// contain a valid API token header if the request is from a third party.
// Get my user information (Must be authenticated first)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Todo token abilities
// https://laravel.com/docs/9.x/sanctum#token-abilities
