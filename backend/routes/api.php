<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

// 🔹 Public Routes (Authentication)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🔹 Protected Routes (Requires Authentication)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // 🔹 Admin Routes (Full Access)
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json(['message' => 'Welcome Admin!']);
        });

        // ✅ Inventory Management
        Route::prefix('/inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'getAll']);
            Route::post('/add', [InventoryController::class, 'addProduct']);
            Route::put('/update/{id}', [InventoryController::class, 'updateProduct']);
            Route::delete('/delete/{id}', [InventoryController::class, 'deleteProduct']);
        });

        // ✅ User Management (Admin Only)
        Route::prefix('/users')->group(function () {
            Route::get('/', [UserController::class, 'getAllUsers']);
            Route::post('/create', [UserController::class, 'createUser']);
            Route::put('/update/{id}', [UserController::class, 'updateUser']);
            Route::delete('/delete/{id}', [UserController::class, 'deleteUser']);
        });

        // ✅ Reports
        Route::prefix('/reports')->group(function () {
            Route::get('/sales', [ReportController::class, 'salesReport']);
            Route::get('/inventory', [ReportController::class, 'inventoryReport']);
            Route::get('/customers', [ReportController::class, 'customerReport']);
        });
    });

    // 🔹 Cashier Routes (Sales Access Only)
    Route::middleware('role:cashier,admin')->group(function () {
        Route::get('/cashier/dashboard', function () {
            return response()->json(['message' => 'Welcome Cashier!']);
        });

        // ✅ Sales Management
        Route::prefix('/sales')->group(function () {
            Route::get('/', [SalesController::class, 'getAll']);
            Route::post('/process', [SalesController::class, 'processSale']);
            Route::post('/refund/{id}', [SalesController::class, 'refundSale']);
        });

        // ✅ Customer Management (Cashier Can Only View)
        Route::get('/customers', [CustomerController::class, 'getAllCustomers']);
    });

    // 🔹 Manager Routes (Customer & Sales Reports)
    Route::middleware('role:manager,admin')->group(function () {
        Route::get('/manager/dashboard', function () {
            return response()->json(['message' => 'Welcome Manager!']);
        });

        // ✅ Customer Management (Full Access)
        Route::prefix('/customers')->group(function () {
            Route::get('/', [CustomerController::class, 'getAllCustomers']);
            Route::post('/add', [CustomerController::class, 'addCustomer']);
            Route::put('/update/{id}', [CustomerController::class, 'updateCustomer']);
            Route::delete('/delete/{id}', [CustomerController::class, 'deleteCustomer']);
        });

        // ✅ Reports
        Route::prefix('/reports')->group(function () {
            Route::get('/customer-sales', [ReportController::class, 'customerSalesReport']);
        });
    });
});
