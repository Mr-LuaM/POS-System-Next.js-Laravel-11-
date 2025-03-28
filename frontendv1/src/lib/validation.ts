// 📁 lib/validation.ts

/**
 * ✅ Validation Rules Interface
 */
export interface ValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    numeric?: boolean;
    pattern?: RegExp;
  }
  
  /**
   * ✅ Generic Validation Function
   * @param value - Input value to validate
   * @param rules - Validation rules object
   * @returns Validation error message (if any)
   */
  export const validateInput = (value: string, rules: ValidationRules): string | null => {
    if (rules.required && !value.trim()) return "This field is required.";
  
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters long.`;
    }
  
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be at most ${rules.maxLength} characters long.`;
    }
  
    if (rules.numeric && !/^\d+$/.test(value)) {
      return "Only numbers are allowed.";
    }
  
    if (rules.pattern && !rules.pattern.test(value)) {
      return "Invalid format.";
    }
  
    return null; // ✅ No errors
  };
  