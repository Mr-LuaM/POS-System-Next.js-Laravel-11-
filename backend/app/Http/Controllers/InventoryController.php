<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * Display a listing of all products.
     */
    public function getAll()
    {
        $products = Product::with('category', 'supplier', 'store')->get();
        return response()->json(['products' => $products], 200);
    }

    /**
     * Store a newly created product.
     */
    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());

        return response()->json([
            'message' => 'Product added successfully',
            'product' => $product
        ], 201);
    }

    /**
     * Update the specified product.
     */
    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'sku' => 'string|unique:products,sku,' . $id,
            'price' => 'numeric|min:0',
            'stock_quantity' => 'integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->all());

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ], 200);
    }

    /**
     * Remove the specified product.
     */
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    /**
     * Stock Movement: Restock, Sale, Adjustment, Damage, Return
     */
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
