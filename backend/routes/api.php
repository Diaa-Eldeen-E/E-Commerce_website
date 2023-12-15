<?php

use App\Models\Order;
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


// Search using scout
Route::get('search', function (Request $request) {
    return response()->json([
        'data' => \App\Models\Product::search($request->query('q'))->take(3)->get(),
        'count' => \App\Models\Product::search($request->query('q'))->count()
    ]);
});


Route::get('products/search', [\App\Http\Controllers\ProductController::class, 'searchProducts']);
Route::get('product/{product_id}', [\App\Http\Controllers\ProductController::class, 'getProduct']);
Route::get('products/{category_id}', [\App\Http\Controllers\ProductController::class, 'getProducts']);
Route::get('categories', [\App\Http\Controllers\CategoryController::class, 'getCategories']);
Route::get('category/{category_id}', [\App\Http\Controllers\CategoryController::class, 'getCategory']);
Route::get('nestedcategories', [\App\Http\Controllers\CategoryController::class, 'getNestedCategories']);

Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);

// Unauthinticated redirection (Invalid token)
Route::any('unauthenticated', function (Request $request) {
    return response('Unauthenticated', 401);
})->name('unauthenticated');

// Admin actions
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::post('category', [\App\Http\Controllers\CategoryController::class, 'addCategory']);
    Route::put('category/{category_id}', [\App\Http\Controllers\CategoryController::class, 'updateCategory']);
    Route::delete('category/{category_id}', [\App\Http\Controllers\CategoryController::class, 'deleteCategory']);
    Route::post('product', [\App\Http\Controllers\ProductController::class, 'addProduct']);
    Route::put('product/{product_id}', [\App\Http\Controllers\ProductController::class, 'updateProduct']);
    Route::delete('product/{product_id}', [\App\Http\Controllers\ProductController::class, 'deleteProduct']);
});

// Disable CSRF for stripe webhook
Route::post('/stripe-webhook', [\App\Http\Controllers\CartController::class, 'handleStripeWebhook']);


// Handle logout (Must be authenticated first) (User actions)
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/cart-checkout', [\App\Http\Controllers\CartController::class, 'cartCheckout']);
    Route::get('/cart-checkout1', [\App\Http\Controllers\CartController::class, 'cartCheckout1']);
    Route::get('/cart-checkout2', [\App\Http\Controllers\CartController::class, 'cartCheckout2']);
    Route::post('/create-intent', [\App\Http\Controllers\CartController::class, 'cartCreatePaymentIntent']);


    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    // Check admin authorization, (Check authentication before calling checkAuth)
    Route::get('checkAuth', [\App\Http\Controllers\AuthController::class, 'checkAuth']);

    Route::get('wishlist', [\App\Http\Controllers\WishlistController::class, 'getWishlist']);
    Route::post('wishlist', [\App\Http\Controllers\WishlistController::class, 'addToWishlist']);
    Route::delete('wishlist/{product_id}', [\App\Http\Controllers\WishlistController::class, 'removeFromWishlist']);
    Route::get('islisted/{product_id}', [\App\Http\Controllers\WishlistController::class, 'isListed']);

    Route::get('cart', [\App\Http\Controllers\CartController::class, 'getCart']);
    Route::get('cartcount', [\App\Http\Controllers\CartController::class, 'getCartCount']);
    Route::post('cart', [\App\Http\Controllers\CartController::class, 'addToCart']);
    Route::delete('cart/{product_id}', [\App\Http\Controllers\CartController::class, 'removeFromCart']);
    Route::get('iscarted/{product_id}', [\App\Http\Controllers\CartController::class, 'isCarted']);

    Route::get('order/all', [\App\Http\Controllers\OrderController::class, 'getOrders']);
    Route::get('order/{order_id}', [\App\Http\Controllers\OrderController::class, 'getOrder']);
    Route::get('order/checkout/{session_id}', [\App\Http\Controllers\OrderController::class, 'getCheckoutOrder']);

    Route::get('user-review/{product_id}', [\App\Http\Controllers\ProductController::class, 'getUserReview']);
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
