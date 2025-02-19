<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    /**
     * ✅ Fetch all users (Active & Archived based on Query Parameter)
     */
    public function getAllUsers(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = User::select('id', 'name', 'email', 'role', 'created_at', 'deleted_at');

            if ($archived === 'true') {
                $query = $query->onlyTrashed(); // ✅ Get only archived users
            } elseif ($archived === 'false') {
                $query = $query->whereNull('deleted_at'); // ✅ Get only active users
            } else {
                $query = $query->withTrashed(); // ✅ Get both active & archived users
            }

            $users = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Users fetched successfully',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * ✅ Create a new user
     */
    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,cashier,manager'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Update user details
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::withTrashed()->findOrFail($id); // ✅ Include archived users

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:6'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update([
                'name' => $request->name ?? $user->name,
                'email' => $request->email ?? $user->email,
                'password' => $request->password ? Hash::make($request->password) : $user->password
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Soft-delete (archive) a user
     */
    public function archiveUser($id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot archive your own account.'
                ], 403);
            }

            $user->delete(); // ✅ Soft-delete

            return response()->json([
                'success' => true,
                'message' => 'User archived successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Restore an archived user
     */
    public function restoreUser($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id); // ✅ Find only archived users

            $user->restore(); // ✅ Restore user

            return response()->json([
                'success' => true,
                'message' => 'User restored successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ❌ Permanently delete a user (Only if archived)
     */
    public function deleteUser($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id); // ✅ Find only archived users

            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account.'
                ], 403);
            }

            $user->forceDelete(); // ✅ Permanently delete user

            return response()->json([
                'success' => true,
                'message' => 'User permanently deleted'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to permanently delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Change user role
     */
    public function updateUserRole(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot change your own role.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'role' => 'required|in:admin,cashier,manager'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['role' => $request->role]);

            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user role',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
