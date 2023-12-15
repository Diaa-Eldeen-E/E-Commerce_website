<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Cart_item;
use App\Models\Order;

class CartController extends Controller
{

    protected function handleStripeSessionCompleteEvent($session)
    {
        // Update the user's order state
        $order = Order::Where('session_id', $session->id)->first();
        $order->status = 'paid';
        $order->save();

        // Update products stock
        foreach ($order->products()->get() as $product) {
            $product->stock = $product->stock - $product->pivot->quantity;
            $product->save();
        }

        // Clear the cart
        $order->user()->first()->cart()->first()->clear();
    }

    public function handleStripeWebhook(Request $request)
    {
        $out = new \Symfony\Component\Console\Output\ConsoleOutput();
        $payload = $request->getContent();
        $event = null;

        // Validate payload
        try {
            $event = \Stripe\Event::constructFrom(json_decode($payload, true));
        } catch (\UnexpectedValueException $e) {
            // invalid payload
            $out->writeln('Webhook error while parsing basic request.');
            return response('', 400);
        }

        // Validate stripe signature
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            $out->writeln('Webhook error while validating signature.');
            return response('', 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'payment_intent.succeeded':
                $out->writeln('payment_intent.succeeded');
                $paymentIntent = $event->data->object; // contains a \Stripe\PaymentIntent

                // Invoice?
                // Sales data 
                // handlePaymentIntentSucceeded($paymentIntent);

                break;
            case 'issuing_authorization.request':
                $out->writeln('issuing_authorization.request accepted');
                $auth = $event->data->object;
                return response()->json(['approved' => true], 200, ['Stripe-Version' => '2023-10-16']);
                break;

            case 'checkout.session.completed':
                $out->writeln('checkout.session.completed');
                $session = $event->data->object;
                $out->writeln('session');
                $out->writeln($session);
                $this->handleStripeSessionCompleteEvent($session);
                break;

            default:
                // Unexpected event type
                $out->writeln('Received unknown event type');
                $out->writeln($event->type);
        }
        return response('');
    }



    public function cartCheckout(Request $request)
    {
        // Calculate the total price of the user's cart 
        $cartProducts = $request->user()->cart()->first()->products()->get();
        $totalAmount = 0;
        $line_items = [];
        foreach ($cartProducts as $product) {
            $totalAmount += $product->price * $product->pivot->quantity;
            $line_items[] = [
                // 'price' => 'price_id', Required conditionally
                'price_data' => [
                    // 'product' => 'product_id'  // Required conditionally
                    'product_data' => [
                        'name' => $product->name,

                    ],
                    'currency' => 'usd',
                    'unit_amount' => $product->price

                ],
                'quantity' => $product->pivot->quantity,    // Required
            ];
        }

        // Create a stripe session
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $session = $stripe->checkout->sessions->create(
            [
                'success_url' => env('APP_URL') . '/checkout-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('APP_URL') . '/cart',
                'line_items' => $line_items,
                'mode' => 'payment',    // One time payment (vs subscription)

            ]
        );

        // Create an order for the user and attach cart products to it
        $order = $request->user()->orders()->create([
            'session_id' => $session->id,
            'total_price' => $totalAmount,
            'status' => 'unpaid'
        ]);
        foreach ($cartProducts as $product) {
            $order->products()->attach($product->id, ['quantity' => $product->pivot->quantity]);
        }

        // Return the stripe checkout page url to redirect the user to it
        return response()->json([
            // 'client_secret' => $intent->client_secret,   // for Payment intents
            'stripe_checkout_url' => $session->url
        ]);
    }


    // ------------- Another checkout methods  ----------------------

    public function cartCheckout1(Request $request)
    {
        return $request->user()->checkout('price_1OM5RWLKQgcrUNY7wI92OzIU', [
            'success_url' => 'http://localhost:3000/',
            'cancel_url' => 'http://localhost:3000/cart'
        ]);
    }

    public function cartCheckout2(Request $request)
    {

        return $request->user()->checkoutCharge(1200, 'test-product2', 5, [
            'success_url' => 'http://localhost:3000/',
            'cancel_url' => 'http://localhost:3000/cart'
        ]);
    }

    public function cartCreatePaymentIntent(Request $request)
    {
        // Calculate the total price of the user's cart 
        $cartProducts = $request->user()->cart()->first()->products()->get();
        $totalAmount = 0;
        foreach ($cartProducts as $product) {
            $totalAmount += $product->price * $product->pivot->quantity;
        }
        // return response()->json($totalAmount);
        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $intent = $stripe->paymentIntents->create(
            [
                'amount' => $totalAmount,
                'currency' => 'usd'
            ]
        );
        return response()->json([
            'client_secret' => $intent->client_secret
        ]);
        // return $request->user()->checkout('price_1OM5RWLKQgcrUNY7wI92OzIU', [
        //     'success_url' => 'http://localhost:3000/',
        //     'cancel_url' => 'http://localhost:3000/cart'
        // ]);
    }

    // ------------------------------------------------------------

    //
    public function addToCart(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }
        $product = Product::where('id', $request->product_id)->first();
        if ($request->quantity > $product->stock)
            return response()->json(['The requested quantity is unavailable'], 400);

        // Add the product to this user's cart
        $prevCartItem = $request->user()->cart()->first()->items()
            ->where('product_id', $request->product_id)->first();

        // Already in cart?
        if ($prevCartItem) {
            // Add this quantity to the previous quantity if available
            if ($request->quantity + $prevCartItem->quantity > $product->stock)
                return response()->json(['The requested quantity is unavailable'], 400);
            else {
                $prevCartItem->quantity += $request->quantity;
                $prevCartItem->save();
            }
        } // Not previously carted -> Create a new cart item
        else {
            $cart_item = new Cart_item([
                'product_id' => $request->product_id,
                'cart_id' => $request->user()->cart()->first()->id,
                'quantity' => $request->quantity
            ]);
            $cart_item->save();

            //            $request->user()->cart()->first()->products()
            //                ->attach($request->product_id, ['quantity' => $request->quantity]);
        }

        return response()->json([
            'message' => 'Items added to cart successfully'
        ]);
    }

    public function removeFromCart(Request $request, $product_id)
    {
        // Validate input
        $validator = Validator::make(array_merge($request->all(), ['product_id' => $product_id]), [
            'product_id' => 'required|integer|exists:cart_items,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Remove the product from the user's cart
        $deleted = $request->user()->cart()->first()->items()
            ->where('product_id', $request->product_id)->delete();

        if ($deleted)
            return response()->json([
                'message' => 'Product removed from cart'
            ]);
        else
            return response()->json(['Failed to delete'], 500);
    }


    public function isCarted(Request $request, $product_id)
    {
        $validator = Validator::make(['product_id' => $product_id], [
            'product_id' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $item = $request->user()->cart()->first()->items()->where('product_id', $request->product_id)->first();

        if ($item)
            return response()->json([
                'iscarted' => 1,
                'quantity' => $item->quantity,
            ]);
        else
            return response()->json([
                'iscarted' => 0,
            ]);
    }

    public function getCart(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:0',
            'size' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
                'message' => 'Invalid inputs'
            ], Response::HTTP_BAD_REQUEST);
        }

        $page_size = $request->size ? $request->size : 10;

        return response()->json($request->user()->cart()->first()->products()->paginate($page_size));
    }

    public function getCartCount(Request $request)
    {
        return response()->json($request->user()->cart()->first()->products()->count());
    }
}
