<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    //

    public function getOrders(Request $request)
    {
        $orders = $request->user()->orders()->where('status', 'paid')->orderBy('created_at', 'DESC')->get();
        foreach ($orders as $order) {
            $order->products = $order->products()->get();
        }
        return response()->json($orders);
    }

    public function getCheckoutOrder(Request $request, $session_id)
    {
        $order = $request->user()->orders()->where('session_id', $session_id)->first();
        if (!$order)
            return response('', 404);

        // Attach order products to the order object
        $order->products = $order->products()->get();
        return response()->json($order);
    }

    public function getOrder(Request $request, $order_id)
    {
        $order = $request->user()->orders()->where('id', $order_id)->first();
        if (!$order)
            return response('', 404);

        // Attach order products to the order object
        $order->products = $order->products()->get();
        return response()->json($order);
    }
}
