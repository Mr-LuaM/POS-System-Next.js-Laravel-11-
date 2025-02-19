<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    /**
     * ✅ Get All Stores (Active & Archived Based on Query Parameter)
     */
    public function getAll(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = Store::select('id', 'name', 'location', 'created_at', 'deleted_at');

            if ($archived === 'true') {
                $query = $query->onlyTrashed(); // ✅ Get only archived stores
            } elseif ($archived === 'false') {
                $query = $query->whereNull('deleted_at'); // ✅ Get only active stores
            } else {
                $query = $query->withTrashed(); // ✅ Get both active & archived stores
            }

            $stores = $query->orderBy('id', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Stores fetched successfully',
                'data' => $stores
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stores',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Add a New Store
     */
    public function addStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:stores,name',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $store = Store::create($request->only(['name', 'location']));

            return response()->json([
                'success' => true,
                'message' => 'Store added successfully',
                'data' => $store
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add store',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Update a Store
     */
    public function updateStore(Request $request, $id)
    {
        try {
            $store = Store::withTrashed()->findOrFail($id); // ✅ Include archived stores

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:stores,name,' . $id,
                'location' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $store->update($request->only(['name', 'location']));

            return response()->json([
                'success' => true,
                'message' => 'Store updated successfully',
                'data' => $store
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update store',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Archive Store (Soft Delete)
     */
    public function archiveStore($id)
    {
        try {
            $store = Store::findOrFail($id);

            // ✅ Prevent deletion if linked to sales, products, or employees
            if ($store->sales()->exists() || $store->products()->exists() || $store->employeeShifts()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete store. It has related records in sales, inventory, or employee shifts.'
                ], 400);
            }

            $store->delete(); // ✅ Soft-delete

            return response()->json([
                'success' => true,
                'message' => 'Store archived successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive store',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Restore Store (Undo Soft Delete)
     */
    public function restoreStore($id)
    {
        try {
            $store = Store::onlyTrashed()->findOrFail($id); // ✅ Find only archived stores
            $store->restore();

            return response()->json([
                'success' => true,
                'message' => 'Store restored successfully',
                'data' => $store
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore store',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ❌ Permanently Delete a Store (Only If Already Archived)
     */
    public function forceDeleteStore($id)
    {
        try {
            $store = Store::onlyTrashed()->findOrFail($id); // ✅ Find only archived stores
            $store->forceDelete(); // ✅ Permanently delete store

            return response()->json([
                'success' => true,
                'message' => 'Store permanently deleted'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to permanently delete store',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
