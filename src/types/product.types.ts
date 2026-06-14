export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface ProductCategoryRef {
  id: number;
  name: string;
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  selling_price: string;
  mrp: string;
  status: ProductStatus;
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

export interface ItemStock {
  id: number;
  name: string;
  total_stock: number;
  available_stock: number;
  min_order_qty: number;
  max_order_qty: number;
  lead_time: number;
  status: ProductStatus;
  is_not_returnable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetItemStockResponse {
  success: boolean;
  data: {
    rows: ItemStock[];
  };
  message: string;
}

export interface BulkUpdateItemStockProduct {
  id: number;
  total_stock?: number;
  available_stock?: number;
  status?: ProductStatus;
  is_not_returnable?: boolean;
  min_order_qty?: number;
  max_order_qty?: number;
  lead_time?: number;
}

export interface BulkUpdateItemStockPayload {
  products: BulkUpdateItemStockProduct[];
}

export interface BulkUpdateItemStockResponse {
  success: boolean;
  data: boolean;
  message: string;
}

export interface UpdateSingleItemStockPayload {
  total_stock?: number;
  available_stock?: number;
  status?: ProductStatus;
  is_not_returnable?: boolean;
  min_order_qty?: number;
  max_order_qty?: number;
  lead_time?: number;
}

export interface UpdateSingleItemStockResponse {
  success: boolean;
  data: Product;
  message: string;
}
