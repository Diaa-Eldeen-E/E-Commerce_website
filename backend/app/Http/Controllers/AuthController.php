<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    //
    public function register (Request $request)
    {
        // Validate the form data received
        $validator = Validator::make($request->all(), [
            'username'=>'required|unique:users,name',
            'email'=>'required|email|max:255|unique:users,email',
            'password'=>'required|min:8'
        ]);

        if($validator->fails())
        {
            return response()->json([
                'validation_errors'=>$validator->messages(),
                'message'=>'Invalid inputs'
            ]);
        }
        else {
            $user = User::create([
                'name'=>$request->username,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
            ]);

            $token = $user->createToken($user->email . '_Token');
            return response()->json([
                'status'=>200,
                'username'=>$user->name,
                'token'=>$token->plainTextToken,
                'message'=>'Registered successfully'
            ]);
        }
    }


    public function login (Request $request)
    {
        // Check that user exists and the passwords are matching
        $user = User::where('name', $request->username)->first();
        if(! $user || ! Hash::check($request->password, $user->password))
        {
            return response()->json([
                'status'=>401,
                'message'=>'Invalid credentials'
            ]);

        }
        else {
            $token = $user->createToken($user->name . '_Token')->plainTextToken;

            return response()->json([
                'status'=>200,
                'username'=>$user->name,
                'token'=>$token,
                'isAdmin'=>$user->role == 1 ? 1 : 0,
                'message'=>'Logged in successfully'
            ]);
        }
    }


    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'status'=>200,
            'message'=>'Logged out successfully'
        ]);
    }

    public function checkAuth(Request $request)
    {
        $user_role = $request->user()->role;
        if ($user_role == 1)
            return response()->json([
              'user_role'=>$user_role ? 1 : 0
         ]);
        else
            return response()->json(['Error, Unauthorized'], 401);
    }
}
