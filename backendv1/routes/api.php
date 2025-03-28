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
use App\Http\Controllers\TransactionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'getAll']);
        Route::post('/add', [CategoryController::class, 'addCategory'])->middleware('role:admin');
        Route::put('/update/{id}', [CategoryController::class, 'updateCategory'])->middleware('role:admin');
        Route::delete('/delete/{id}', [CategoryController::class, 'deleteCategory'])->middleware('role:admin');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json(['message' => 'Welcome Admin!']);
        });

        // ✅ User Management
        Route::prefix('/users')->group(function () {
            Route::get('/', [UserController::class, 'getAllUsers']);
            Route::post('/create', [UserController::class, 'createUser']);
            Route::put('/update/{id}', [UserController::class, 'updateUser']);
            Route::delete('/archive/{id}', [UserController::class, 'archiveUser']);
            Route::put('/restore/{id}', [UserController::class, 'restoreUser']);
            Route::delete('/delete/{id}', [UserController::class, 'deleteUser']);
            Route::put('/update-role/{id}', [UserController::class, 'updateUserRole']);
        });



        // ✅ Inventory Management (Admins See All, Store Managers Limited)
        Route::prefix('/inventory')->group(function () {
            // Route::get('/', [InventoryController::class, 'getAll']); // ✅ Fetch all inventory
            Route::post('/add', [InventoryController::class, 'addProduct']); // ✅ Add product
            Route::put('/update/{id}', [InventoryController::class, 'updateProduct']); // ✅ Update product

            // ✅ Stock Management
            Route::put('/manage-stock/{storeProductId}', [InventoryController::class, 'manageStock']); // ✅ Update stock (Restock, Sale, Damage, etc.)

            // ✅ Store-Level Archive/Restore
            Route::put('/store-archive/{id}', [InventoryController::class, 'storeArchiveProduct']); // ✅ Archive in Store
            Route::put('/store-restore/{id}', [InventoryController::class, 'storeRestoreProduct']); // ✅ Restore in Store

            // ✅ Global-Level Archive/Restore (Admin Only)
            Route::put('/global-archive/{id}', [InventoryController::class, 'globalArchiveProduct']); // ✅ Global Archive
            Route::put('/global-restore/{id}', [InventoryController::class, 'globalRestoreProduct']); // ✅ Global Restore

            // ✅ Permanent Deletion (Admin Only)
            Route::delete('/delete/{id}', [InventoryController::class, 'deleteProduct']); // ✅ Hard delete


            // ✅ Store-Level Pricing & Threshold Management
            Route::put('/update-price/{storeProductId}', [InventoryController::class, 'updatePrice']);
            Route::put('/update-threshold/{storeProductId}', [InventoryController::class, 'updateThreshold']);
        });



        // ✅ Reports
        Route::prefix('/reports')->group(function () {
            Route::get('/sales', [ReportController::class, 'salesReport']);
            Route::get('/inventory', [ReportController::class, 'inventoryReport']);
            Route::get('/customers', [ReportController::class, 'customerReport']);
            Route::get('/expenses', [ReportController::class, 'expenseReport']);
        });

        // ✅ Customers
        // Route::prefix('/customers')->group(function () {
        //     Route::get('/', [CustomerController::class, 'getAllCustomers']);
        //     Route::post('/add', [CustomerController::class, 'addCustomer']);
        //     Route::put('/update/{id}', [CustomerController::class, 'updateCustomer']);
        //     Route::delete('/archive/{id}', [CustomerController::class, 'archiveCustomer']); // ✅ Soft Delete
        //     Route::put('/restore/{id}', [CustomerController::class, 'restoreCustomer']); // ✅ Restore
        //     Route::delete('/delete/{id}', [CustomerController::class, 'deleteCustomer']); // ✅ Permanent Delete
        // });


        // ✅ Discounts
        Route::prefix('/discounts')->group(function () {
            Route::get('/', [DiscountController::class, 'getAll']);
            Route::post('/add', [DiscountController::class, 'addDiscount']);
            Route::put('/update/{id}', [DiscountController::class, 'updateDiscount']);
            Route::delete('/archive/{id}', [DiscountController::class, 'archiveDiscount']); // ✅ Soft Delete
            Route::put('/restore/{id}', [DiscountController::class, 'restoreDiscount']); // ✅ Restore
            Route::delete('/delete/{id}', [DiscountController::class, 'deleteDiscount']); // ✅ Permanent Delete
        });
    });

    Route::middleware('role:cashier,admin,manager')->group(function () {
        Route::get('/cashier/dashboard', function () {
            return response()->json(['message' => 'Welcome Cashier!']);
        });

        // ✅ Inventory (Cashier Only Sees Their Store’s Inventory)
        Route::prefix('/inventory')->group(function () {
            Route::get('/', [InventoryController::class, 'getAll']); // ✅ Restricted in controller
            Route::get('/search', [InventoryController::class, 'searchBySkuOrBarcode']); // ✅ Fix API route

        });

        // ✅ Sales Management
        Route::prefix('/sales')->group(function () {
            Route::get('/', [SalesController::class, 'getAll']);
            Route::post('/process', [SalesController::class, 'processSale']);
            Route::post('/refund/{id}', [SalesController::class, 'refundSale']);
        });
        Route::post('/transaction/complete', [TransactionController::class, 'completeTransaction']);

        // ✅ Payments
        Route::prefix('/payments')->group(function () {
            Route::get('/', [PaymentController::class, 'getAll']);
            Route::post('/add', [PaymentController::class, 'processPayment']);
        });

        // ✅ Cash Drawer
        Route::prefix('/cash-drawer')->group(function () {
            Route::get('/', [CashDrawerController::class, 'getCashDrawer']);
            Route::post('/open', [CashDrawerController::class, 'openDrawer']);
            Route::post('/close', [CashDrawerController::class, 'closeDrawer']);
        });
        Route::prefix('/customers')->group(function () {
            Route::get('/search', [CustomerController::class, 'searchByBarcode']); // ✅ Ensure this comes first!

            Route::get('/', [CustomerController::class, 'index']); // ✅ Get all customers
            Route::post('/add', [CustomerController::class, 'store']); // ✅ Register a new customer
            Route::get('/{id}', [CustomerController::class, 'show']); // ✅ Get a single customer (AFTER search!)
            Route::put('/update/{id}', [CustomerController::class, 'update']); // ✅ Update customer
            Route::delete('/delete/{id}', [CustomerController::class, 'destroy']); // ✅ Soft delete customer
            Route::put('/restore/{id}', [CustomerController::class, 'restore']); // ✅ Restore soft deleted customer
            Route::delete('/force-delete/{id}', [CustomerController::class, 'forceDelete']); // ✅ Permanently delete customer
        });
        Route::get('/customers-with-loyalty', [CustomerController::class, 'getCustomersWithLoyaltyPoints']);
        Route::post('/claim-loyalty', [CustomerController::class, 'claimLoyaltyPoints']);
        // ✅ Store Management
        Route::prefix('/stores')->group(function () {
            Route::get('/{id}', [StoreController::class, 'show']); // ✅ View a store

        });
        Route::get('/discounts/code/{code}', [DiscountController::class, 'getDiscountByCode']);
        // ✅ Store Management
        Route::prefix('/stores')->group(function () {
            Route::get('/', [StoreController::class, 'getAll']);
            Route::post('/create', [StoreController::class, 'addStore']);
            Route::put('/update/{id}', [StoreController::class, 'updateStore']);
            Route::delete('/archive/{id}', [StoreController::class, 'archiveStore']);
            Route::put('/restore/{id}', [StoreController::class, 'restoreStore']);
            Route::delete('/delete/{id}', [StoreController::class, 'deleteStore']);
        });
        Route::get('/store/{store_id}/cash-drawers', [CashDrawerController::class, 'getAllCashDrawers']);
        Route::post('/store/cash-drawer/{cashDrawerId}/update-actual-cash', [CashDrawerController::class, 'updateActualCash']);

        Route::get('/store/{store_id}/cash-status', [CashDrawerController::class, 'checkCashVariance']);
        Route::post('/store/cash-drawer/{id}/update-closing-balance', [CashDrawerController::class, 'updateClosingBalance']);

        Route::get('/store/{store_id}/daily-cash-summary', [CashDrawerController::class, 'getDailyCashSummary']);
        // ✅ Suppliers
        Route::prefix('/suppliers')->group(function () {
            Route::get('/', [SupplierController::class, 'getAll']);
            Route::post('/add', [SupplierController::class, 'addSupplier']);
            Route::put('/update/{id}', [SupplierController::class, 'updateSupplier']);
            Route::delete('/archive/{id}', [SupplierController::class, 'archiveSupplier']); // ✅ Soft Delete
            Route::put('/restore/{id}', [SupplierController::class, 'restoreSupplier']); // ✅ Restore
            Route::delete('/delete/{id}', [SupplierController::class, 'deleteSupplier']); // ✅ Permanent Delete
        });
    });

    Route::middleware('role:manager,admin')->group(function () {
        Route::get('/manager/dashboard', function () {
            return response()->json(['message' => 'Welcome Manager!']);
        });

        // // ✅ Inventory (Managers See Their Store’s Inventory)
        // Route::prefix('/inventory')->group(function () {
        //     Route::get('/', [InventoryController::class, 'getAll']); // ✅ Restricted in controller
        // });
        // ✅ Expenses
        Route::prefix('/expenses')->group(function () {
            Route::get('/', [ExpenseController::class, 'index']);
            Route::post('/add', [ExpenseController::class, 'store']);
            Route::put('/{id}', [ExpenseController::class, 'update']); // ✅ Soft Delete

            Route::delete('/archive/{id}', [ExpenseController::class, 'archiveExpense']); // ✅ Soft Delete
            Route::put('/restore/{id}', [ExpenseController::class, 'restoreExpense']); // ✅ Restore
            Route::delete('/delete/{id}', [ExpenseController::class, 'deleteExpense']); // ✅ Permanent Delete
        });
        // ✅ Customer Management

        Route::prefix('/discounts')->middleware('role:admin')->group(function () {
            Route::get('/', [DiscountController::class, 'getAll']);
            Route::post('/add', [DiscountController::class, 'addDiscount']);
            Route::put('/update/{id}', [DiscountController::class, 'updateDiscount']);
            Route::delete('/archive/{id}', [DiscountController::class, 'archiveDiscount']); // ✅ Soft Delete
            Route::put('/restore/{id}', [DiscountController::class, 'restoreDiscount']); // ✅ Restore
            Route::delete('/delete/{id}', [DiscountController::class, 'deleteDiscount']); // ✅ Hard Delete
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
        Route::get('/inventory/stock-movements', [InventoryController::class, 'getStockMovements']);
        Route::get('/inventory/low-stock', [InventoryController::class, 'getLowStockProducts']); // ✅ Fetch low-stock alerts

        Route::get('/sales/{sale}/items', [SalesController::class, 'getSaleItems']); // ✅ Fetch sale items
        Route::post('/sales/{saleId}/refund', [RefundController::class, 'processRefund']);

        Route::get('/analytics-report', [ReportController::class, 'analyticsReport']);
        Route::get('/dashboard', [ReportController::class, 'dashboard']);
        Route::post('/inventory/quick-add', [InventoryController::class, 'quickAddProduct']);
    });
});
