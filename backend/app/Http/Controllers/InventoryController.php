<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StoreProduct;
use App\Models\StockMovement;
use App\Models\Category;
use App\Models\Supplier;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventoryController extends Controller
{
    /**
     * ✅ Get inventory (Admins see all, Cashiers & Managers see only their store)
     */
    public function getAll(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');
            $storeId = $request->query('store_id');
            $user = Auth::user();

            // 🔹 Base Query: Fetch inventory with related product details
            $query = StoreProduct::with([
                'product' => fn($query) => $query->withTrashed(), // ✅ Always include soft-deleted products
                'product.category',
                'product.supplier' => fn($query) => $query->withTrashed(), // ✅ Ensure soft-deleted suppliers are included
                'store'
            ]);

            // 🔹 Filter Archived Items
            if ($archived === 'true') {
                // ✅ Fetch only archived (soft-deleted) items
                $query->onlyTrashed()->orWhereHas('product', fn($p) => $p->onlyTrashed());
            } elseif ($archived === 'false') {
                // ✅ Fetch only active (non-deleted) items
                $query->whereNull('store_products.deleted_at')
                    ->whereHas('product', fn($p) => $p->whereNull('deleted_at'));
            } else {
                // ✅ Fetch both active & archived items (default behavior)
                $query->withTrashed();
            }

            // 🔹 Apply Additional Filters
            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id); // 🔹 Restrict non-admin users
            }

            if (!empty($storeId)) {
                $query->where('store_id', $storeId); // ✅ Filter by store if provided
            }

            $query->orderByDesc('id'); // ✅ More readable orderBy

            // 🔍 Fetch Results & Debug Query
            $inventory = $query->get();
            Log::info($query->toSql(), $query->getBindings());

            // ✅ Return Response
            return $inventory->isEmpty()
                ? ResponseService::success('No inventory found', [])
                : ResponseService::success('Inventory fetched successfully', $inventory);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch inventory', $e->getMessage());
        }
    }




    /**
     * ✅ Add a new product (Admin Only)
     */
    public function addProduct(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return ResponseService::error('Unauthorized access', null, 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'sku' => 'required|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'qr_code' => 'nullable|string|max:255|unique:products,qr_code',
            'category_id' => 'nullable|exists:categories,id',
            'new_category' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'new_supplier' => 'nullable|string|max:255',
            'stores' => 'required|array',
            'stores.*.store_id' => 'required|exists:stores,id',
            'stores.*.price' => 'required|numeric|min:0',
            'stores.*.stock_quantity' => 'required|integer|min:0',
            'stores.*.low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors());
        }

        try {
            // 🔹 Handle "Other" Category
            if ($request->category_id === 'other' && !empty($request->new_category)) {
                $category = Category::create(['name' => $request->new_category]);
                $request->merge(['category_id' => $category->id]);
            }

            // 🔹 Handle "Other" Supplier
            if ($request->supplier_id === 'other' && !empty($request->new_supplier)) {
                $supplier = Supplier::create(['name' => $request->new_supplier]);
                $request->merge(['supplier_id' => $supplier->id]);
            }

            $product = Product::create($request->only(['name', 'sku', 'barcode', 'qr_code', 'category_id', 'supplier_id']));

            foreach ($request->stores as $store) {
                StoreProduct::create([
                    'product_id' => $product->id,
                    'store_id' => $store['store_id'],
                    'price' => $store['price'],
                    'stock_quantity' => $store['stock_quantity'],
                    'low_stock_threshold' => $store['low_stock_threshold'] ?? 0,
                ]);
            }

            return ResponseService::success('Product added successfully', $product->load('stores'));
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add product', $e->getMessage());
        }
    }

    /**
     * ✅ Update a product (Admin Only)
     */
    public function updateProduct(Request $request, $store_product_id)
    {
        if (Auth::user()->role !== 'admin') {
            return ResponseService::error('Unauthorized access', null, 403);
        }

        try {
            // 🔹 Get the store product record first
            $storeProduct = StoreProduct::findOrFail($store_product_id);
            $product = Product::findOrFail($storeProduct->product_id);

            // 🔹 Validate Input
            $validator = Validator::make($request->all(), [
                'name' => "required|string|max:255|unique:products,name,{$product->id}",
                'sku' => "required|string|max:255|unique:products,sku,{$product->id}",
                'barcode' => "nullable|string|max:255|unique:products,barcode,{$product->id}",
                'qr_code' => "nullable|string|max:255|unique:products,qr_code,{$product->id}",
                'category_id' => 'nullable|exists:categories,id',
                'new_category' => 'nullable|string|max:255',
                'supplier_id' => 'nullable|exists:suppliers,id',
                'new_supplier' => 'nullable|string|max:255',
                'stores' => 'sometimes|array',
                'stores.*.store_id' => 'required|exists:stores,id',
                'stores.*.price' => 'required|numeric|min:0',
                'stores.*.stock_quantity' => 'required|integer|min:0',
                'stores.*.low_stock_threshold' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            // 🔹 Handle "Other" Category (Create new category and assign ID)
            if ($request->filled('new_category')) {
                $category = Category::create(['name' => $request->new_category]);
                $request->merge(['category_id' => $category->id]); // ✅ Ensure ID is assigned
            }

            // 🔹 Handle "Other" Supplier (Create new supplier and assign ID)
            if ($request->filled('new_supplier')) {
                $supplier = Supplier::create(['name' => $request->new_supplier]);
                $request->merge(['supplier_id' => $supplier->id]); // ✅ Ensure ID is assigned
            }

            // 🔹 Update Product Details
            $product->update($request->only(['name', 'sku', 'barcode', 'qr_code', 'category_id', 'supplier_id']));

            // 🔹 Update Store-Level Data
            foreach ($request->stores ?? [] as $store) {
                StoreProduct::updateOrCreate(
                    ['product_id' => $product->id, 'store_id' => $store['store_id']],
                    [
                        'price' => $store['price'],
                        'stock_quantity' => $store['stock_quantity'],
                        'low_stock_threshold' => $store['low_stock_threshold'] ?? 0,
                    ]
                );
            }

            // ✅ Load store_products instead of stores (Fix the error)
            $updatedProduct = Product::with([
                'category',
                'supplier',
                'storeProducts.store' // ✅ Correct way to get stores linked to the product
            ])->find($product->id);

            return ResponseService::success('Product updated successfully', $updatedProduct);
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        }
    }


    /**
     * ✅ Cashiers & Managers can only adjust stock for their store
     */
    public function manageStock(Request $request, $store_product_id)
    {
        return DB::transaction(function () use ($request, $store_product_id) {
            $storeProduct = StoreProduct::lockForUpdate()->findOrFail($store_product_id);
            $user = Auth::user();

            if ($user->role !== 'admin' && $storeProduct->store_id !== $user->store_id) {
                return ResponseService::error('Unauthorized access', null, 403);
            }

            $validator = Validator::make($request->all(), [
                'type' => 'required|in:restock,sale,adjustment,damage,return',
                'quantity' => 'required|integer|min:1',
                'reason' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            // Ensure stock never goes negative
            if (in_array($request->type, ['sale', 'damage', 'adjustment']) && $storeProduct->stock_quantity < $request->quantity) {
                return ResponseService::error('Insufficient stock', null, 400);
            }

            $storeProduct->update([
                'stock_quantity' => $request->type === 'restock' || $request->type === 'return'
                    ? $storeProduct->stock_quantity + $request->quantity
                    : $storeProduct->stock_quantity - $request->quantity
            ]);

            StockMovement::create([
                'product_id' => $storeProduct->product_id,
                'store_id' => $storeProduct->store_id,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'reason' => $request->reason
            ]);

            return ResponseService::success('Stock movement recorded successfully', $storeProduct);
        });
    }

    /**
     * ✅ Archive a product for a specific store (Soft Delete)
     */
    public function archiveProduct($store_product_id)
    {
        try {
            $storeProduct = StoreProduct::findOrFail($store_product_id);
            $storeProduct->delete();

            if (!StoreProduct::where('product_id', $storeProduct->product_id)->whereNull('deleted_at')->exists()) {
                Product::where('id', $storeProduct->product_id)->delete();
            }

            return ResponseService::success('Product archived successfully for this store');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        }
    }
    /**
     * ✅ Get low-stock products per store (Stock < Threshold)
     */
    public function lowStockAlerts(Request $request)
    {
        try {
            $store_id = $request->query('store_id');

            $query = StoreProduct::with(['product'])
                ->whereColumn('stock_quantity', '<', 'low_stock_threshold');

            if ($store_id) {
                $query->where('store_id', $store_id);
            }

            return ResponseService::success(
                'Low-stock products fetched successfully',
                $query->get()
            );
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch low-stock products', $e->getMessage());
        }
    }

    /**
     * ✅ Restore an archived product for a specific store
     */
    public function restoreProduct($store_product_id)
    {
        try {
            $storeProduct = StoreProduct::onlyTrashed()->findOrFail($store_product_id);
            $storeProduct->restore();

            // 🔹 Restore `products` if at least one store is restored
            if (StoreProduct::where('product_id', $storeProduct->product_id)->whereNull('deleted_at')->exists()) {
                Product::where('id', $storeProduct->product_id)->restore();
            }

            return ResponseService::success('Product restored successfully for this store');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        }
    }

    /**
     * ✅ Permanently delete a product (Only if already archived in all stores)
     */
    public function deleteProduct($store_product_id)
    {
        try {
            $storeProduct = StoreProduct::onlyTrashed()->findOrFail($store_product_id);

            // 🔹 Prevent deletion if product has sales history
            if ($storeProduct->saleItems()->exists()) {
                return ResponseService::error('Cannot delete product. It has sales history.', null, 400);
            }

            $storeProduct->forceDelete();

            // 🔹 Delete `products` only if no stores remain
            if (!StoreProduct::where('product_id', $storeProduct->product_id)->exists()) {
                Product::where('id', $storeProduct->product_id)->forceDelete();
            }

            return ResponseService::success('Product permanently deleted for this store');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        }
    }
}
