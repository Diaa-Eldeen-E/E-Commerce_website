<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class OrderProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('orders_products', function (Blueprint $table) {
            $table->unsignedBigInteger('order_id');

            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('quantity');
            $table->timestamps();

            $table->primary(['order_id', 'product_id']);    // Many-to-many relationship
            $table->foreign('order_id')->references('id')->on('orders')
                ->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
