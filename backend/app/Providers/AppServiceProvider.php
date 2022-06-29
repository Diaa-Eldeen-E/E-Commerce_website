<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Scout\Builder;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //

        //Add this custom validation rule.
        Validator::extend('generic_name', function ($attribute, $value) {

            // This will only accept alpha, numeric, spaces, hyphens, and underscores.
            // match alphanumeric with \w
            // match hyphen with \-
            // match underscore with \_
            // match space with \s
            // the + indicates that there must be at least one character for it to match. use a * instead, if
            // a zero-length string is also ok
            return preg_match('/^[\w\-\_\s]+$/', $value);

        });

        // Add this custom method to scout search
        Builder::macro('count', function () {
            return $this->engine()->getTotalCount(
                $this->engine()->search($this)
            );
        });
    }
}
