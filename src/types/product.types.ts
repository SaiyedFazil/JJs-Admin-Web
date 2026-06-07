export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface ProductCategoryRef {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  selling_price: string;
  mrp: string;
  status: string;
  is_veg: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategoryRef | null;
  images: ProductImage[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationInfo;
  message: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  selling_price: number;
  mrp: number;
  category_id: number;
  is_veg: boolean;
  primary_image?: File;
  all_images?: File[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  selling_price?: number;
  mrp?: number;
  category_id?: number;
  is_veg?: boolean;
  primary_image?: File;
  all_images?: File[];
}
