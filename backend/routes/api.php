<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\CashDrawerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\LoyaltyPointController;
use App\Http\Controllers\RefundController;
use App\Http\Controllers\CategoryController;

// 🔹 Public Routes (Authentication)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🔹 Protected Routes (Requires Authentication)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);


    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/add', [CategoryController::class, 'store']);
        Route::put('/update/{id}', [CategoryController::class, 'update']);
        Route::delete('/delete/{id}', [CategoryController::class, 'destroy']);
    });

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
            Route::get('/low-stock', [InventoryController::class, 'lowStockAlert']);
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
            Route::get('/expenses', [ReportController::class, 'expenseReport']);
        });

        // ✅ Store Management
        Route::prefix('/stores')->group(function () {
            Route::get('/', [StoreController::class, 'getAll']);
            Route::post('/create', [StoreController::class, 'createStore']);
            Route::put('/update/{id}', [StoreController::class, 'updateStore']);
            Route::delete('/delete/{id}', [StoreController::class, 'deleteStore']);
        });

        // ✅ Suppliers
        Route::prefix('/suppliers')->group(function () {
            Route::get('/', [SupplierController::class, 'getAll']);
            Route::post('/add', [SupplierController::class, 'addSupplier']);
            Route::put('/update/{id}', [SupplierController::class, 'updateSupplier']);
            Route::delete('/delete/{id}', [SupplierController::class, 'deleteSupplier']);
        });

        // ✅ Discounts
        Route::prefix('/discounts')->group(function () {
            Route::get('/', [DiscountController::class, 'getAll']);
            Route::post('/add', [DiscountController::class, 'addDiscount']);
            Route::put('/update/{id}', [DiscountController::class, 'updateDiscount']);
            Route::delete('/delete/{id}', [DiscountController::class, 'deleteDiscount']);
        });

        // ✅ Stock Movements
        Route::prefix('/stock-movements')->group(function () {
            Route::get('/', [StockMovementController::class, 'getAll']);
            Route::post('/add', [StockMovementController::class, 'addStockMovement']);
        });

        // ✅ Expenses Tracking
        Route::prefix('/expenses')->group(function () {
            Route::get('/', [ExpenseController::class, 'getAll']);
            Route::post('/add', [ExpenseController::class, 'addExpense']);
            Route::delete('/delete/{id}', [ExpenseController::class, 'deleteExpense']);
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

        // ✅ Payments
        Route::prefix('/payments')->group(function () {
            Route::get('/', [PaymentController::class, 'getAll']);
            Route::post('/add', [PaymentController::class, 'processPayment']);
        });

        // ✅ Cash Drawer (Open/Close)
        Route::prefix('/cash-drawer')->group(function () {
            Route::get('/', [CashDrawerController::class, 'getCashDrawer']);
            Route::post('/open', [CashDrawerController::class, 'openDrawer']);
            Route::post('/close', [CashDrawerController::class, 'closeDrawer']);
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

        // ✅ Customer Loyalty Points
        Route::prefix('/loyalty-points')->group(function () {
            Route::get('/', [LoyaltyPointController::class, 'getAll']);
            Route::post('/add', [LoyaltyPointController::class, 'addPoints']);
        });

        // ✅ Refunds
        Route::prefix('/refunds')->group(function () {
            Route::get('/', [RefundController::class, 'getAll']);
            Route::post('/request/{sale_id}', [RefundController::class, 'requestRefund']);
        });

        // ✅ Reports
        Route::prefix('/reports')->group(function () {
            Route::get('/customer-sales', [ReportController::class, 'customerSalesReport']);
        });
    });
});
