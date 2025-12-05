export interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string;
  type: number;
  level: number;
  subCategories: SubCategory[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string | null;
  type: number;
  subCategories: SubCategory[];
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: string;
  type: number;
}
