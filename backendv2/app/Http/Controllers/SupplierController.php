<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;
use App\Services\ResponseService; // ✅ Import ResponseService

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
                $query = $query->onlyTrashed();
            } elseif ($archived === 'false') {
                $query = $query->whereNull('deleted_at');
            } else {
                $query = $query->withTrashed();
            }

            return ResponseService::success('Suppliers fetched successfully', $query->orderBy('id', 'desc')->get());
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch suppliers', $e->getMessage());
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
            return ResponseService::validationError($validator->errors()); // ✅ Matches frontend expected format
        }

        try {
            $supplier = Supplier::create($request->all());
            return ResponseService::success('Supplier added successfully', $supplier, 201);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add supplier', $e->getMessage());
        }
    }

    /**
     * ✅ Update Supplier
     */
    public function updateSupplier(Request $request, $id)
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'contact' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:suppliers,email,' . $id,
                'address' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $supplier->update($request->all());

            return ResponseService::success('Supplier updated successfully', $supplier);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update supplier', $e->getMessage());
        }
    }

    /**
     * ✅ Archive Supplier (Soft Delete)
     */
    public function archiveSupplier($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();

            return ResponseService::success('Supplier archived successfully');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to archive supplier', $e->getMessage());
        }
    }

    /**
     * ✅ Restore Supplier (Undo Soft Delete)
     */
    public function restoreSupplier($id)
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id);
            $supplier->restore();

            return ResponseService::success('Supplier restored successfully');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to restore supplier', $e->getMessage());
        }
    }

    /**
     * ✅ Permanently Delete Supplier (Only If Already Archived)
     */
    public function deleteSupplier($id)
    {
        try {
            $supplier = Supplier::onlyTrashed()->findOrFail($id);
            $supplier->forceDelete();

            return ResponseService::success('Supplier permanently deleted');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to delete supplier', $e->getMessage());
        }
    }
}
