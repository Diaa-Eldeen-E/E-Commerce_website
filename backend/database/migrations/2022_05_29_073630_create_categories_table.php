<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->autoIncrement();  // Primary key
            $table->string('name', 255)->unique();
            $table->string('image_src')->default('/assets/products/no_image.png');
            $table->unsignedBigInteger('parent_id')->nullable()->default(NULL);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('categories')
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
        Schema::dropIfExists('categories');
    }
}
