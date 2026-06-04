import * as Yup from "yup";

/**
 * Password Validation Library
 * Validates administrative passwords against strict security criteria:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*()_+\-={}[\]|;:'"\\,<.>/?`~]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const imageValidation = Yup.mixed<File>()
  .test("fileSize", "File is too large. Max size is 5MB.", (value) => {
    if (!value) return true;
    return value.size <= FILE_SIZE;
  })
  .test("fileFormat", "Unsupported file format. Only JPG, JPEG, and PNG are allowed.", (value) => {
    if (!value) return true;
    return SUPPORTED_FORMATS.includes(value.type);
  });

/**
 * Unified category validation schema.
 * @param isEdit - If true, image is optional. If false (create mode), image is required.
 */
export const categorySchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Category name is required.")
      .min(2, "Category name must be at least 2 characters.")
      .max(50, "Category name must be at most 50 characters."),
    category_image: isEdit
      ? imageValidation.nullable().optional()
      : imageValidation.required("Category image is required."),
  });
