<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Services\ResponseService; // ✅ Import ResponseService

class UserController extends Controller
{
    public function getAllUsers(Request $request)
    {
        try {
            $archived = $request->query('archived', 'all');

            $query = User::query()
                ->leftJoin('stores', 'users.store_id', '=', 'stores.id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'users.role',
                    'users.created_at',
                    'users.deleted_at',
                    'users.store_id',
                    'stores.name as store_name' // ✅ Add store name
                );

            if ($archived === 'true') {
                $query->onlyTrashed();
            } elseif ($archived === 'false') {
                $query->whereNull('users.deleted_at');
            } else {
                $query->withTrashed();
            }

            return ResponseService::success('Users fetched successfully', $query->get());
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch users', $e->getMessage());
        }
    }



    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:6',
            'role'      => 'required|in:admin,cashier,manager',
            'store_id'  => 'nullable|exists:stores,id',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors());
        }

        // ✅ Additional business logic validation
        if ($request->role === 'admin' && $request->filled('store_id')) {
            return ResponseService::validationError([
                'store_id' => ['Admins should not be assigned to a store.']
            ]);
        }

        if (in_array($request->role, ['cashier', 'manager']) && !$request->filled('store_id')) {
            return ResponseService::validationError([
                'store_id' => ['Store is required for this role.']
            ]);
        }

        try {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'role'      => $request->role,
                'store_id'  => $request->role !== 'admin' ? $request->store_id : null,
            ]);

            return ResponseService::success('User created successfully', $user, 201);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to create user', $e->getMessage());
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::withTrashed()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name'      => 'sometimes|string|max:255',
                'email'     => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'password'  => 'nullable|string|min:6',
                'role'      => 'sometimes|in:admin,cashier,manager',
                'store_id'  => 'nullable|exists:stores,id',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $role = $request->role ?? $user->role;

            // ✅ Business Logic Checks
            if ($role === 'admin' && $request->filled('store_id')) {
                return ResponseService::validationError([
                    'store_id' => ['Admins should not be assigned to a store.']
                ]);
            }

            if (in_array($role, ['cashier', 'manager']) && !$request->filled('store_id')) {
                return ResponseService::validationError([
                    'store_id' => ['Store is required for this role.']
                ]);
            }

            // ✅ Safe field updates
            $user->update([
                'name'      => $request->name ?? $user->name,
                'email'     => $request->email ?? $user->email,
                'password'  => $request->password ? Hash::make($request->password) : $user->password,
                'role'      => $role,
                'store_id'  => $role === 'admin' ? null : $request->store_id,
            ]);

            return ResponseService::success('User updated successfully', $user);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update user', $e->getMessage());
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
                return ResponseService::error('You cannot archive your own account.', null, 403);
            }

            $user->delete();
            return ResponseService::success('User archived successfully');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to archive user', $e->getMessage());
        }
    }

    /**
     * ✅ Restore an archived user
     */
    public function restoreUser($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
            $user->restore();

            return ResponseService::success('User restored successfully', $user);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to restore user', $e->getMessage());
        }
    }

    /**
     * ✅ Permanently delete a user (Only if archived)
     */
    public function deleteUser($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);

            if ($user->id === Auth::id()) {
                return ResponseService::error('You cannot delete your own account.', null, 403);
            }

            $user->forceDelete();
            return ResponseService::success('User permanently deleted');
        } catch (\Exception $e) {
            return ResponseService::error('Failed to permanently delete user', $e->getMessage());
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
                return ResponseService::error('You cannot change your own role.', null, 403);
            }

            $validator = Validator::make($request->all(), [
                'role' => 'required|in:admin,cashier,manager'
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $user->update(['role' => $request->role]);

            return ResponseService::success('User role updated successfully', $user);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update user role', $e->getMessage());
        }
    }
}
