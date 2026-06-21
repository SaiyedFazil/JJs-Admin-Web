import type { PaginationInfo } from "./product.types";
import type { EnumRoles } from "@/common/enum";

/**
 * A user record returned by the super-admin users listing endpoint.
 * Covers both application users (role = "user") and staff (admin / super_admin / rider).
 */
export interface User {
  id: number;
  role: EnumRoles | string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
}

export interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  pagination: PaginationInfo;
  message: string;
}
