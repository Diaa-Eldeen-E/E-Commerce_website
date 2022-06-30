<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('wishlist_id')->after('role')->nullable();
            $table->unsignedBigInteger('cart_id')->after('role')->nullable();

            $table->foreign('cart_id')->references('id')->on('carts')
                ->nullOnDelete();
            $table->foreign('wishlist_id')->references('id')->on('wishlists')
                ->nullOnDelete();
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
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['wishlist_id']);
            $table->dropForeign(['cart_id']);
            $table->dropColumn(['wishlist_id', 'cart_id']);
        });
    }
}
