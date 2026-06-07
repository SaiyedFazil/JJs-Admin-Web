export interface Banner {
  id: number;
  title: string;
  description: string;
  banner: string;
  mobile_banner: string;
  text_color: string;
  is_active: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllBannersResponse {
  success: boolean;
  message: string;
  data: Banner[];
  pagination?: Pagination;
}

export interface CreateBannerPayload {
  title: string;
  description: string;
  banner: File;
  mobileBanner: File;
  textColor: string;
  isActive: boolean;
}

export interface UpdateBannerPayload {
  title?: string;
  description?: string;
  banner?: File;
  mobileBanner?: File;
  textColor?: string;
  isActive?: boolean;
}
