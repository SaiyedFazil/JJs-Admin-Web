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

/**
 * Unified product validation schema.
 * @param isEdit - If true, images are optional (since existing ones can be kept). If false, at least 1 image is required.
 */
export const productSchema = (isEdit: boolean) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Product name is required.")
      .min(2, "Product name must be at least 2 characters.")
      .max(30, "Product name must be at most 30 characters."),
    description: Yup.string()
      .trim()
      .required("Description is required.")
      .max(500, "Description must be at most 500 characters."),
    selling_price: Yup.number()
      .typeError("Selling price must be a number.")
      .required("Selling price is required.")
      .positive("Selling price must be a positive number.")
      .max(99999, "Selling price cannot exceed 5 digits."),
    mrp: Yup.number()
      .typeError("MRP must be a number.")
      .required("MRP is required.")
      .positive("MRP must be a positive number.")
      .max(99999, "MRP cannot exceed 5 digits."),
    category_id: Yup.number()
      .required("Category selection is required.")
      .integer("Category selection is required.")
      .positive("Category selection is required."),
    is_veg: Yup.boolean().required("Veg/Non-veg selection is required."),
    images: Yup.array()
      .of(
        Yup.object().shape({
          file: Yup.mixed<File>().optional(),
          previewUrl: Yup.string().required(),
          is_primary: Yup.boolean().required(),
        })
      )
      .test("has-images", "At least one image is required.", function (value) {
        if (!isEdit && (!value || value.length === 0)) {
          return false;
        }
        return true;
      })
      .test("max-images", "You can upload up to 10 images.", function (value) {
        if (value && value.length > 10) {
          return false;
        }
        return true;
      })
      .test("one-primary", "Exactly one image must be set as primary.", function (value) {
        if (!value || value.length === 0) {
          return true; // Valid if empty in edit mode
        }
        const primaryCount = value.filter((img) => img.is_primary).length;
        if (!isEdit) {
          return primaryCount === 1;
        }
        return primaryCount <= 1; // In edit mode, at most 1 new image is marked primary
      }),
  });
