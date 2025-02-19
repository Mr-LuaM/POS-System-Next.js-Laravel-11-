<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Services\ResponseService; // ✅ Import ResponseService

class CategoryController extends Controller
{
    protected $category;

    /**
     * ✅ Inject Category Model
     */
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * ✅ Get all categories.
     */
    public function getAll()
    {
        try {
            return ResponseService::success('Categories fetched successfully', $this->category->all());
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch categories', $e->getMessage());
        }
    }

    /**
     * ✅ Add a new category.
     */
    public function addCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors()); // ✅ Matches frontend expected format
        }

        try {
            $category = $this->category->create(['name' => $request->name]);
            return ResponseService::success('Category added successfully', $category, 201);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add category', $e->getMessage());
        }
    }

    /**
     * ✅ Update a category.
     */
    public function updateCategory(Request $request, $id)
    {
        try {
            $category = $this->category->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => "required|string|max:255|unique:categories,name,{$id}",
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $category->update(['name' => $request->name]);

            return ResponseService::success('Category updated successfully', $category);
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Category not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update category', $e->getMessage());
        }
    }

    /**
     * ✅ Delete a category.
     */
    public function deleteCategory($id)
    {
        try {
            $category = $this->category->findOrFail($id);
            $category->delete();

            return ResponseService::success('Category deleted successfully');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Category not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to delete category', $e->getMessage());
        }
    }
}
