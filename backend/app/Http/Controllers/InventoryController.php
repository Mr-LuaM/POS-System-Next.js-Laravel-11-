<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StoreProduct;
use App\Models\StockMovement;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * ✅ Get all store-specific inventory (Active & Archived)
     */
    public function getAll(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = StoreProduct::with(['product.category', 'product.supplier', 'store'])
                ->select(
                    'id',
                    'store_id',
                    'product_id',
                    'price',
                    'stock_quantity',
                    'low_stock_threshold',
                    'deleted_at'
                );

            if ($archived === 'true') {
                $query->onlyTrashed();
            } elseif ($archived === 'false') {
                $query->whereNull('deleted_at');
            } else {
                $query->withTrashed();
            }

            return ResponseService::success('Store inventory fetched successfully', $query->orderBy('id', 'desc')->get());
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch inventory', $e->getMessage());
        }
    }

    /**
     * ✅ Add a new product to a store
     */
    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'sku' => 'required|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'qr_code' => 'nullable|string|max:255|unique:products,qr_code',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'stores' => 'required|array', // ✅ Multiple stores
            'stores.*.store_id' => 'required|exists:stores,id',
            'stores.*.price' => 'required|numeric|min:0',
            'stores.*.stock_quantity' => 'required|integer|min:0',
            'stores.*.low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors());
        }

        try {
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
     * ✅ Update a product (Stock Updates via manageStock)
     */
    public function updateProduct(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => "required|string|max:255|unique:products,name,{$id}",
                'sku' => "required|string|max:255|unique:products,sku,{$id}",
                'barcode' => "nullable|string|max:255|unique:products,barcode,{$id}",
                'qr_code' => "nullable|string|max:255|unique:products,qr_code,{$id}",
                'category_id' => 'nullable|exists:categories,id',
                'supplier_id' => 'nullable|exists:suppliers,id',
                'stores' => 'sometimes|array',
                'stores.*.store_id' => 'required|exists:stores,id',
                'stores.*.price' => 'required|numeric|min:0',
                'stores.*.stock_quantity' => 'required|integer|min:0',
                'stores.*.low_stock_threshold' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $product->update($request->only(['name', 'sku', 'barcode', 'qr_code', 'category_id', 'supplier_id']));

            if (!empty($request->stores)) {
                foreach ($request->stores as $store) {
                    StoreProduct::updateOrCreate(
                        ['product_id' => $product->id, 'store_id' => $store['store_id']],
                        [
                            'price' => $store['price'],
                            'stock_quantity' => $store['stock_quantity'],
                            'low_stock_threshold' => $store['low_stock_threshold'] ?? 0,
                        ]
                    );
                }
            }

            return ResponseService::success('Product updated successfully', $product->load('stores'));
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        }
    }

    /**
     * ✅ Manage stock for a specific store's product
     */
    public function manageStock(Request $request, $store_product_id)
    {
        return \DB::transaction(function () use ($request, $store_product_id) {
            $storeProduct = StoreProduct::lockForUpdate()->findOrFail($store_product_id);

            $validator = Validator::make($request->all(), [
                'type' => 'required|in:restock,sale,adjustment,damage,return',
                'quantity' => 'required|integer|min:1',
                'reason' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            if (in_array($request->type, ['sale', 'damage']) && $storeProduct->stock_quantity < $request->quantity) {
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

            // 🔹 Check if ALL stores for this product are archived → Archive `products`
            $activeStores = StoreProduct::where('product_id', $storeProduct->product_id)
                ->whereNull('deleted_at')
                ->exists();

            if (!$activeStores) {
                Product::where('id', $storeProduct->product_id)->delete();
            }

            return ResponseService::success('Product archived successfully for this store');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
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
            Product::where('id', $storeProduct->product_id)->restore();

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

            if ($storeProduct->saleItems()->exists()) {
                return ResponseService::error('Cannot delete product. It has sales history.', null, 400);
            }

            $storeProduct->forceDelete();

            // 🔹 Check if ALL stores are deleted → Delete `products`
            $remainingStores = StoreProduct::where('product_id', $storeProduct->product_id)->exists();

            if (!$remainingStores) {
                Product::where('id', $storeProduct->product_id)->forceDelete();
            }

            return ResponseService::success('Product permanently deleted for this store');
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
}
