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

    // 🔹 Categories (Common Access)
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'getAll']);
        Route::post('/add', [CategoryController::class, 'addCategory']);
        Route::put('/update/{id}', [CategoryController::class, 'updateCategory']);
        Route::delete('/delete/{id}', [CategoryController::class, 'deleteCategory']);
    });

    // 🔹 Admin Routes (Full Access)
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json(['message' => 'Welcome Admin!']);
        });

        // ✅ User Management
        Route::prefix('/users')->group(function () {
            Route::get('/', [UserController::class, 'getAllUsers']);
            Route::post('/create', [UserController::class, 'createUser']);
            Route::put('/update/{id}', [UserController::class, 'updateUser']);
            Route::delete('/archive/{id}', [UserController::class, 'archiveUser']); // ✅ Soft Delete (Archive)
            Route::put('/restore/{id}', [UserController::class, 'restoreUser']); // ✅ Restore
            Route::delete('/delete/{id}', [UserController::class, 'deleteUser']); // ✅ Permanent Delete
            Route::put('/update-role/{id}', [UserController::class, 'updateUserRole']);
        });

        // ✅ Inventory Management
        Route::prefix('/inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'getAll']); // ✅ Fetch all products
            Route::post('/add', [InventoryController::class, 'addProduct']); // ✅ Add new product
            Route::put('/update/{id}', [InventoryController::class, 'updateProduct']); // ✅ Update product details
            Route::delete('/archive/{id}', [InventoryController::class, 'archiveProduct']); // ✅ Soft Delete (Archive)
            Route::put('/restore/{id}', [InventoryController::class, 'restoreProduct']); // ✅ Restore archived product
            Route::delete('/delete/{id}', [InventoryController::class, 'deleteProduct']); // ✅ Permanent Delete

            // ✅ New Stock Management Routes
            Route::put('/manage-stock/{id}', [InventoryController::class, 'manageStock']); // ✅ Manage stock (restock, sale, adjustment, damage, return)
            Route::get('/low-stock-alerts', [InventoryController::class, 'lowStockAlerts']); // ✅ Fetch low-stock products
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
            Route::post('/create', [StoreController::class, 'addStore']);
            Route::put('/update/{id}', [StoreController::class, 'updateStore']);
            Route::delete('/archive/{id}', [StoreController::class, 'archiveStore']); // ✅ Soft Delete
            Route::put('/restore/{id}', [StoreController::class, 'restoreStore']); // ✅ Restore
            Route::delete('/delete/{id}', [StoreController::class, 'deleteStore']); // ✅ Permanent Delete
        });

        // ✅ Suppliers
        Route::prefix('/suppliers')->group(function () {
            Route::get('/', [SupplierController::class, 'getAll']);
            Route::post('/add', [SupplierController::class, 'addSupplier']);
            Route::put('/update/{id}', [SupplierController::class, 'updateSupplier']);
            Route::delete('/archive/{id}', [SupplierController::class, 'archiveSupplier']); // ✅ Soft Delete
            Route::put('/restore/{id}', [SupplierController::class, 'restoreSupplier']); // ✅ Restore
            Route::delete('/delete/{id}', [SupplierController::class, 'deleteSupplier']); // ✅ Permanent Delete
        });

        // ✅ Customers
        Route::prefix('/customers')->group(function () {
            Route::get('/', [CustomerController::class, 'getAllCustomers']);
            Route::post('/add', [CustomerController::class, 'addCustomer']);
            Route::put('/update/{id}', [CustomerController::class, 'updateCustomer']);
            Route::delete('/archive/{id}', [CustomerController::class, 'archiveCustomer']); // ✅ Soft Delete
            Route::put('/restore/{id}', [CustomerController::class, 'restoreCustomer']); // ✅ Restore
            Route::delete('/delete/{id}', [CustomerController::class, 'deleteCustomer']); // ✅ Permanent Delete
        });


        // ✅ Discounts
        Route::prefix('/discounts')->group(function () {
            Route::get('/', [DiscountController::class, 'getAll']);
            Route::post('/add', [DiscountController::class, 'addDiscount']);
            Route::put('/update/{id}', [DiscountController::class, 'updateDiscount']);
            Route::delete('/archive/{id}', [DiscountController::class, 'archiveDiscount']); // ✅ Soft Delete
            Route::put('/restore/{id}', [DiscountController::class, 'restoreDiscount']); // ✅ Restore
            Route::delete('/delete/{id}', [DiscountController::class, 'deleteDiscount']); // ✅ Permanent Delete
        });

        // ✅ Expenses
        Route::prefix('/expenses')->group(function () {
            Route::get('/', [ExpenseController::class, 'getAll']);
            Route::post('/add', [ExpenseController::class, 'addExpense']);
            Route::delete('/archive/{id}', [ExpenseController::class, 'archiveExpense']); // ✅ Soft Delete
            Route::put('/restore/{id}', [ExpenseController::class, 'restoreExpense']); // ✅ Restore
            Route::delete('/delete/{id}', [ExpenseController::class, 'deleteExpense']); // ✅ Permanent Delete
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
