<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->string('page_url');
            $table->string('referrer')->nullable();
            $table->dateTime('visited_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
