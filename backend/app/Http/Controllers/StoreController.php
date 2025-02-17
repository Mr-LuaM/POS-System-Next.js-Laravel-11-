<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    /**
     * Get all stores.
     */
    public function getAll()
    {
        $stores = Store::all();
        return response()->json(['stores' => $stores], 200);
    }

    /**
     * Add a new store.
     */
    public function addStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:stores,name',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $store = Store::create($request->all());

        return response()->json([
            'message' => 'Store added successfully',
            'store' => $store
        ], 201);
    }

    /**
     * Update a store.
     */
    public function updateStore(Request $request, $id)
    {
        $store = Store::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:stores,name,' . $id,
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $store->update($request->all());

        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $store
        ], 200);
    }

    /**
     * Delete a store.
     */
    public function deleteStore($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();

        return response()->json(['message' => 'Store deleted successfully'], 200);
    }
}
