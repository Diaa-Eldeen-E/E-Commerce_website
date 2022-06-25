<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();  // Primary key
            $table->string('name', 255)->unique();
            $table->unsignedBigInteger('category_id');
            $table->string('image_src')->default('assets/products/no_image.png');
            $table->text('description');
            $table->unsignedDouble('price');
            $table->unsignedInteger('stock');
            $table->unsignedInteger('stars')->default(0);
//            Add a relation to users ratings (stars)


            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')
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
        Schema::dropIfExists('products');
    }
}
