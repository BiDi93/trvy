<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->unique()->nullable()->after('email');
            $table->enum('role', ['customer', 'freelancer', 'admin'])->default('customer')->after('phone');
            $table->string('avatar')->nullable()->after('role');
            $table->string('kyc_document')->nullable()->after('avatar');
            $table->enum('kyc_status', ['pending', 'approved', 'rejected'])->default('pending')->after('kyc_document');
            $table->boolean('is_active')->default(true)->after('kyc_status');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role', 'avatar', 'kyc_document', 'kyc_status', 'is_active', 'deleted_at']);
        });
    }
};
