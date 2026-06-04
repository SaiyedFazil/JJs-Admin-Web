export interface Category {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllCategoriesResponse {
  success: boolean;
  data: Category[];
  message: string;
}
