<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;
use App\Services\ResponseService; // ✅ Import ResponseService
use Illuminate\Http\JsonResponse;

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
                $query = $query->onlyTrashed();
            } elseif ($archived === 'false') {
                $query = $query->whereNull('deleted_at');
            } else {
                $query = $query->withTrashed();
            }

            return ResponseService::success('Stores fetched successfully', $query->orderBy('id', 'desc')->get());
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch stores', $e->getMessage());
        }
    }

    /**
     * ✅ Fetch a single store by ID
     */
    public function show($id): JsonResponse
    {
        $store = Store::withTrashed()->find($id);
        if (!$store) return response()->json(['success' => false, 'message' => 'Store not found'], 404);

        return response()->json(['success' => true, 'data' => $store]);
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
            return ResponseService::validationError($validator->errors()); // ✅ Matches frontend expected format
        }

        try {
            $store = Store::create($request->only(['name', 'location']));
            return ResponseService::success('Store added successfully', $store, 201);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add store', $e->getMessage());
        }
    }

    /**
     * ✅ Update a Store
     */
    public function updateStore(Request $request, $id)
    {
        try {
            $store = Store::withTrashed()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:stores,name,' . $id,
                'location' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $store->update($request->only(['name', 'location']));

            return ResponseService::success('Store updated successfully', $store);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update store', $e->getMessage());
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
                return ResponseService::error('Cannot delete store. It has related records in sales, inventory, or employee shifts.', null, 400);
            }

            $store->delete();
            return ResponseService::success('Store archived successfully');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to archive store', $e->getMessage());
        }
    }

    /**
     * ✅ Restore Store (Undo Soft Delete)
     */
    public function restoreStore($id)
    {
        try {
            $store = Store::onlyTrashed()->findOrFail($id);
            $store->restore();

            return ResponseService::success('Store restored successfully', $store);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to restore store', $e->getMessage());
        }
    }

    /**
     * ✅ Permanently Delete a Store (Only If Already Archived)
     */
    public function forceDeleteStore($id)
    {
        try {
            $store = Store::onlyTrashed()->findOrFail($id);
            $store->forceDelete();

            return ResponseService::success('Store permanently deleted');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to permanently delete store', $e->getMessage());
        }
    }
}
