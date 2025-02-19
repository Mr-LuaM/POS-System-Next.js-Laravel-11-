<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * ✅ Get All Suppliers (Active & Archived Based on Query Parameter)
     */
    public function getAll(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = Supplier::select('id', 'name', 'contact', 'email', 'address', 'created_at', 'deleted_at');

            if ($archived === 'true') {
                $query = $query->onlyTrashed(); // ✅ Get only archived suppliers
            } elseif ($archived === 'false') {
                $query = $query->whereNull('deleted_at'); // ✅ Get only active suppliers
            } else {
                $query = $query->withTrashed(); // ✅ Get both active & archived suppliers
            }

            $suppliers = $query->orderBy('id', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Suppliers fetched successfully',
                'data' => $suppliers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch suppliers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Add a New Supplier
     */
    public function addSupplier(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:suppliers,email',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $supplier = Supplier::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Supplier added successfully',
                'data' => $supplier
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add supplier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Update Supplier
     */
    public function updateSupplier(Request $request, $id)
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id); // ✅ Include archived suppliers

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'contact' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:suppliers,email,' . $id,
                'address' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $supplier->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Supplier updated successfully',
                'data' => $supplier
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update supplier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Archive Supplier (Soft Delete)
     */
    public function archiveSupplier($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete(); // ✅ Soft-delete

            return response()->json([
                'success' => true,
                'message' => 'Supplier archived successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive supplier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Restore Supplier (Undo Soft Delete)
     */
    public function restoreSupplier($id)
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id); // ✅ Find only archived suppliers
            $supplier->restore();

            return response()->json([
                'success' => true,
                'message' => 'Supplier restored successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore supplier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Permanently Delete Supplier (Only If Already Archived)
     */
    public function deleteSupplier($id)
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id); // ✅ Find only archived suppliers
            $supplier->forceDelete(); // ✅ Permanently delete supplier

            return response()->json([
                'success' => true,
                'message' => 'Supplier permanently deleted'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete supplier',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
