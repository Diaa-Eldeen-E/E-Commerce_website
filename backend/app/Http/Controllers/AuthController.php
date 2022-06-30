<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Cart;

class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        // Validate the form data received
        $validator = Validator::make($request->all(), [
            'username' => 'required|alpha_dash|max:255|unique:users,name',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:8|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ]);
        }

        // Create an empty Cart and an empty Wishlist for the user
        $cart = Cart::create([]);
        $wishlist = Wishlist::create([]);

        // Create the user
        $user = new User;
        $user->name = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->cart_id = $cart->id;
        $user->wishlist_id = $wishlist->id;
        $user->save();

        $token = $user->createToken($user->email . '_Token');
        return response()->json([
            'status' => 200,
            'username' => $user->name,
            'token' => $token->plainTextToken,
            'message' => 'Registered successfully'
        ]);

    }


    public function login(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'username' => 'required|alpha_dash|max:255|exists:users,name',
            'password' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid credentials'
            ]);
        }

        // Check that user exists and the passwords are matching
        $user = User::where('name', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid credentials'
            ]);

        } else {
            $token = $user->createToken($user->name . '_Token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'username' => $user->name,
                'token' => $token,
                'isAdmin' => $user->role == 1 ? 1 : 0,
                'message' => 'Logged in successfully'
            ]);
        }
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Logged out successfully'
        ]);
    }

    public function checkAuth(Request $request)
    {
        $user_role = $request->user()->role;
        if ($user_role == 1)
            return response()->json([
                'user_role' => $user_role ? 1 : 0
            ]);
        else
            return response()->json(['Error, Unauthorized'], 401);
    }
}
