<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Discount;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Services\ResponseService; // ✅ Import ResponseService

class DiscountController extends Controller
{
    protected $discount;

    /**
     * ✅ Inject Discount Model
     */
    public function __construct(Discount $discount)
    {
        $this->discount = $discount;
    }

    /**
     * ✅ Get all discounts.
     */
    /**
     * ✅ Get all discounts with category & product names.
     */
    public function getAll()
    {
        try {
            $discounts = $this->discount
                ->with(['category:id,name', 'product:id,name']) // ✅ Fetch category & product names
                ->latest()
                ->get()
                ->map(function ($discount) {
                    return [
                        'id' => $discount->id,
                        'code' => $discount->code,
                        'discount_value' => $discount->discount_value,
                        'discount_type' => $discount->discount_type,
                        'applies_to' => $discount->applies_to,
                        'valid_until' => $discount->valid_until,
                        'category' => $discount->category ? ['id' => $discount->category->id, 'name' => $discount->category->name] : null,
                        'product' => $discount->product ? ['id' => $discount->product->id, 'name' => $discount->product->name] : null,
                        'min_purchase_amount' => $discount->min_purchase_amount,
                    ];
                });

            return ResponseService::success('Discounts fetched successfully', $discounts);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch discounts', $e->getMessage());
        }
    }


    /**
     * ✅ Get Discount Details by Code (For POS Use)
     */
    public function getDiscountByCode($code)
    {
        try {
            $discount = $this->discount
                ->where('code', $code)
                ->where(function ($query) {
                    $query->whereNull('valid_until')->orWhere('valid_until', '>', now());
                }) // ✅ Ensure discount is not expired
                ->firstOrFail();

            return ResponseService::success('Discount found', $discount);
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Invalid or expired discount code', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to fetch discount', $e->getMessage());
        }
    }

    /**
     * ✅ Add a new discount.
     */
    public function addDiscount(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:discounts,code',
            'discount_value' => 'required|numeric|min:0',
            'discount_type' => 'required|in:fixed,percentage',
            'valid_until' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError($validator->errors()); // ✅ Matches frontend expected format
        }

        try {
            $discount = $this->discount->create($request->all());
            return ResponseService::success('Discount added successfully', $discount, 201);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to add discount', $e->getMessage());
        }
    }

    /**
     * ✅ Update a discount.
     */
    public function updateDiscount(Request $request, $id)
    {
        try {
            $discount = $this->discount->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'code' => "required|string|max:50|unique:discounts,code,{$id}",
                'discount_value' => 'required|numeric|min:0',
                'discount_type' => 'required|in:fixed,percentage',
                'valid_until' => 'nullable|date|after:today',
            ]);

            if ($validator->fails()) {
                return ResponseService::validationError($validator->errors());
            }

            $discount->update($request->all());

            return ResponseService::success('Discount updated successfully', $discount);
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Discount not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to update discount', $e->getMessage());
        }
    }

    /**
     * ✅ Soft Delete (Archive) Discount.
     */
    public function archiveDiscount($id)
    {
        try {
            $discount = $this->discount->findOrFail($id);
            $discount->delete(); // Soft delete

            return ResponseService::success('Discount archived successfully');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Discount not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to archive discount', $e->getMessage());
        }
    }

    /**
     * ✅ Restore Soft Deleted Discount.
     */
    public function restoreDiscount($id)
    {
        try {
            $discount = $this->discount->withTrashed()->findOrFail($id);
            $discount->restore();

            return ResponseService::success('Discount restored successfully');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Discount not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to restore discount', $e->getMessage());
        }
    }

    /**
     * ✅ Permanently Delete Discount.
     */
    public function deleteDiscount($id)
    {
        try {
            $discount = $this->discount->withTrashed()->findOrFail($id);
            $discount->forceDelete(); // Hard delete

            return ResponseService::success('Discount deleted permanently');
        } catch (ModelNotFoundException $e) {
            return ResponseService::error('Discount not found', null, 404);
        } catch (\Exception $e) {
            return ResponseService::error('Failed to delete discount', $e->getMessage());
        }
    }
}
