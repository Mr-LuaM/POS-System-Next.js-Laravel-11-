<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Services\ResponseService;
use App\Models\StockMovement; // ✅ Import stock movement model

class ProductController extends Controller
{
    /**
     * ✅ Get all products (Active & Archived based on query)
     */
    public function getAll(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = Product::with(['category', 'supplier'])->select(
                'id',
                'name',
                'sku',
                'barcode',
                'qr_code',
                'price',
                'stock_quantity',
                'low_stock_threshold',
                'category_id',
                'supplier_id',
                'store_id',
                'deleted_at'
            );

            if ($archived === 'true') {
                $query->onlyTrashed();
            } elseif ($archived === 'false') {
                $query->whereNull('deleted_at');
            } else {
                $query->withTrashed();
            }

            $products = $query->orderBy('id', 'desc')->get();

            return ResponseService::success('Products fetched successfully', $products);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch products', $e->getMessage());
        }
    }

    /**
     * ✅ Add a new product
     */
    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products,name',
            'sku' => 'required|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'qr_code' => 'nullable|string|max:255|unique:products,qr_code',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors());
        }

        try {
            $product = Product::create($request->all());
            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'restock',
                'quantity' => $product->stock_quantity,
                'reason' => 'Initial stock added'
            ]);
            if ($product->stock_quantity <= $product->low_stock_threshold) {
                // ✅ Return a warning response if stock is low
                return ResponseService::success('Product added successfully (Warning: Low stock)', $product);
            }
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add product', $e->getMessage());
        }
    }

    /**
     * ✅ Update a product
     */
    public function updateProduct(Request $request, $id)
    {
        try {
            $product = Product::withTrashed()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => "required|string|max:255|unique:products,name,{$id}",
                'sku' => "required|string|max:255|unique:products,sku,{$id}",
                'barcode' => "nullable|string|max:255|unique:products,barcode,{$id}",
                'qr_code' => "nullable|string|max:255|unique:products,qr_code,{$id}",
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0',
                'low_stock_threshold' => 'nullable|integer|min:0',
                'category_id' => 'nullable|exists:categories,id',
                'supplier_id' => 'nullable|exists:suppliers,id',
                'store_id' => 'nullable|exists:stores,id',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $product->update($request->all());
            if ($request->has('stock_quantity')) {
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'adjustment',
                    'quantity' => $request->stock_quantity - $product->stock_quantity,
                    'reason' => 'Manual stock update'
                ]);
            }
            if ($product->stock_quantity <= $product->low_stock_threshold) {
                // ✅ Return a warning response if stock is low
                return ResponseService::success('Product updated successfully (Warning: Low stock)', $product);
            }
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update product', $e->getMessage());
        }
    }
    public function manageStock(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:restock,sale,adjustment,damage,return',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $quantity = $request->quantity;

        if ($request->type === 'restock' || $request->type === 'return') {
            $product->stock_quantity += $quantity;
        } elseif ($request->type === 'sale' || $request->type === 'damage') {
            if ($product->stock_quantity < $quantity) {
                return response()->json(['error' => 'Insufficient stock'], 400);
            }
            $product->stock_quantity -= $quantity;
        }

        $product->save();

        // Log stock movement
        StockMovement::create([
            'product_id' => $product->id,
            'type' => $request->type,
            'quantity' => $quantity,
            'reason' => $request->reason
        ]);

        return response()->json([
            'message' => 'Stock movement recorded successfully',
            'product' => $product
        ], 200);
    }

    /**
     * ✅ Archive a product (Soft Delete) - Prevent if active sales exist
     */
    public function archiveProduct($id)
    {
        try {
            $product = Product::findOrFail($id);

            // ✅ Prevent archiving if product is linked to active sales
            if ($product->saleItems()->exists()) {
                return ResponseService::error('Cannot archive product. It is linked to sales records.', null, 400);
            }

            $product->delete();

            return ResponseService::success('Product archived successfully');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to archive product', $e->getMessage());
        }
    }


    /**
     * ✅ Restore an archived product
     */
    public function restoreProduct($id)
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);
            $product->restore();

            return ResponseService::success('Product restored successfully', $product);
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to restore product', $e->getMessage());
        }
    }

    /**
     * ✅ Permanently delete a product (Only if already archived) - Prevent if linked to sales
     */
    public function deleteProduct($id)
    {
        try {
            $product = Product::onlyTrashed()->findOrFail($id);

            // ✅ Prevent deletion if product has past sales records
            if ($product->saleItems()->exists()) {
                return ResponseService::error('Cannot delete product. It has sales history.', null, 400);
            }

            $product->forceDelete();

            return ResponseService::success('Product permanently deleted');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Product not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to delete product', $e->getMessage());
        }
    }
    /**
     * Get low-stock products (Stock < Threshold)
     */
    public function lowStockAlerts()
    {
        $lowStockProducts = Product::whereColumn('stock_quantity', '<', 'low_stock_threshold')->get();

        return response()->json([
            'low_stock_products' => $lowStockProducts
        ], 200);
    }
}
