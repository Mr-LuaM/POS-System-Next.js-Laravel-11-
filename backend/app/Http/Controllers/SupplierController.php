<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * Display a listing of all suppliers.
     */
    public function getAll()
    {
        $suppliers = Supplier::all();
        return response()->json(['suppliers' => $suppliers], 200);
    }

    /**
     * Store a newly created supplier.
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier = Supplier::create($request->all());

        return response()->json([
            'message' => 'Supplier added successfully',
            'supplier' => $supplier
        ], 201);
    }

    /**
     * Update the specified supplier.
     */
    public function updateSupplier(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:suppliers,email,' . $id,
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier->update($request->all());

        return response()->json([
            'message' => 'Supplier updated successfully',
            'supplier' => $supplier
        ], 200);
    }

    /**
     * Remove the specified supplier.
     */
    public function deleteSupplier($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully'], 200);
    }
}
