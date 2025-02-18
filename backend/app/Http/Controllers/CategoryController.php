<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    protected $category;

    /**
     * Inject Category Model
     */
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * Get all categories.
     */
    public function getAll()
    {
        try {
            $categories = $this->category->all();
            return response()->json([
                'success' => true,
                'categories' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to fetch categories'], 500);
        }
    }

    /**
     * Add a new category.
     */
    public function addCategory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $category = $this->category->create([
                'name' => $request->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category added successfully',
                'category' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error adding category'], 500);
        }
    }

    /**
     * Update a category.
     */
    public function updateCategory(Request $request, $id)
    {
        try {
            $category = $this->category->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => "required|string|max:255|unique:categories,name,{$id}",
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
            }

            $category->update(['name' => $request->name]);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'category' => $category
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error updating category'], 500);
        }
    }

    /**
     * Delete a category.
     */
    public function deleteCategory($id)
    {
        try {
            $category = $this->category->findOrFail($id);
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error deleting category'], 500);
        }
    }
}
