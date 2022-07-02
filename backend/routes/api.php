<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

Route::get('search', function (Request $request) {

    return response()->json([
        'data' => \App\Models\Product::search($request->query('q'))->take(3)->get(),
        'count' => \App\Models\Product::search($request->query('q'))->count()
    ]);
});


// Search
Route::get('products/search', [\App\Http\Controllers\ProductController::class, 'searchProducts']);

Route::get('product', [\App\Http\Controllers\ProductController::class, 'getProduct']);

Route::delete('product/{product_id}', [\App\Http\Controllers\ProductController::class, 'deleteProduct']);

Route::get('products', [\App\Http\Controllers\ProductController::class, 'getProducts']);

//Only admin should be able to add product
Route::post('product', [\App\Http\Controllers\ProductController::class, 'addProduct']);

// Only admin should be able to update product
Route::put('product/{product_id}', [\App\Http\Controllers\ProductController::class, 'updateProduct']);

Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'getCategories']);
Route::get('nestedcategories', [\App\Http\Controllers\CategoryController::class, 'getNestedCategories']);

// Only admin should be able to add category
Route::post('category', [\App\Http\Controllers\CategoryController::class, 'addCategory']);

// Only admin should be able to update category
Route::put('category/{category_id}', [\App\Http\Controllers\CategoryController::class, 'updateCategory']);


// Only admin should be able to delete category
Route::delete('category/{category_id}', [\App\Http\Controllers\CategoryController::class, 'deleteCategory']);

// Check admin authorization, (Check authentication before calling checkAuth)
Route::middleware('auth:sanctum')->get('checkAuth', [\App\Http\Controllers\AuthController::class, 'checkAuth']);

Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);

// Handle logout (Must be authenticated first)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::post('addtowishlist', [\App\Http\Controllers\ProductController::class, 'addToWishlist']);
    Route::post('addtocart', [\App\Http\Controllers\ProductController::class, 'addToCart']);
    Route::delete('removefromwishlist', [\App\Http\Controllers\ProductController::class, 'removeFromWishlist']);
    Route::delete('removefromcart', [\App\Http\Controllers\ProductController::class, 'removeFromCart']);
    Route::get('islisted', [\App\Http\Controllers\ProductController::class, 'isListed']);
    Route::get('iscarted', [\App\Http\Controllers\ProductController::class, 'isCarted']);
    Route::get('wishlist', [\App\Http\Controllers\ProductController::class, 'getWishlist']);
    Route::get('cart', [\App\Http\Controllers\ProductController::class, 'getCart']);
    Route::get('review', [\App\Http\Controllers\ProductController::class, 'getReview']);
    Route::post('review', [\App\Http\Controllers\ProductController::class, 'addReview']);


});


//This guard will ensure that incoming requests are authenticated as either
// stateful, cookie authenticated requests or
// contain a valid API token header if the request is from a third party.
// Get my user information (Must be authenticated first)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Create an admin
Route::get('users/createadmin', function (Request $request) {
    $adminsCount = \App\Models\User::where('role', 1)->count();
    $adminsCount += 1;

    $admin = new \App\Models\User;
    $admin->name = 'admin' . $adminsCount;
    $admin->password = Hash::make('123456');
    $admin->email = 'a' . $adminsCount . "@aa.com";
    $admin->role = 1;
    $admin->save();

    return ("<h1>Username: $admin->name</h1><h1>Password: 123456</h1>");
});

// Todo token abilities
// https://laravel.com/docs/9.x/sanctum#token-abilities
