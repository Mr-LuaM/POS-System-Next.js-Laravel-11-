"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateInput, ValidationRules } from "@/lib/validation"; // ✅ Import reusable validation

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>; // ✅ Ensure onSubmit is async
  categoryName: string;
  setCategoryName: (value: string) => void;
  isEdit?: boolean;
}

/**
 * ✅ Reusable Modal for Adding & Editing Categories (With Real-Time Validation)
 */
export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  isEdit,
}: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Validation Rules
   */
  const categoryValidationRules: ValidationRules = {
    required: true,
    minLength: 3,
    maxLength: 50,
  };

  /**
   * ✅ Handle Input Change with Validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryName(value);
    setError(validateInput(value, categoryValidationRules)); // ✅ Real-time validation
  };

  /**
   * ✅ Handle Form Submission (No Extra Toasts)
   */
  const handleSubmit = async () => {
    const validationError = validateInput(categoryName, categoryValidationRules);
    if (validationError) {
      setError(validationError); // ✅ Show error message (No Toast)
      return;
    }

    setLoading(true);
    await onSubmit(); // ✅ The toast happens inside the hook
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Category Name"
            value={categoryName}
            onChange={handleInputChange}
            className={`bg-muted border ${
              error ? "border-red-500" : "border-border"
            } text-foreground`}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>} {/* ✅ Show Validation Error */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
