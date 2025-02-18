<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    /**
     * ✅ Get all stores.
     */
    public function getAll()
    {
        $stores = Store::all();
        return response()->json(['stores' => $stores], 200);
    }

    /**
     * ✅ Add a new store.
     */
    public function addStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $store = Store::create($request->only(['name', 'location']));

            return response()->json([
                'message' => 'Store added successfully',
                'store' => $store
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add store',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Update a store.
     */
    public function updateStore(Request $request, $id)
    {
        $store = Store::find($id);

        if (!$store) {
            return response()->json([
                'message' => 'Store not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:stores,name,' . $id,
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $store->update($request->only(['name', 'location']));

            return response()->json([
                'message' => 'Store updated successfully',
                'store' => $store
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update store',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * ✅ Delete a store.
     */
    public function deleteStore($id)
    {
        $store = Store::find($id);

        if (!$store) {
            return response()->json([
                'message' => 'Store not found'
            ], 404);
        }

        // ✅ Prevent deleting if linked to sales, products, or employees
        if ($store->sales()->exists() || $store->products()->exists() || $store->employeeShifts()->exists()) {
            return response()->json([
                'message' => 'Cannot delete store. It has related records in sales, inventory, or employee shifts.'
            ], 400);
        }

        try {
            $store->delete();

            return response()->json(['message' => 'Store deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete store',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
