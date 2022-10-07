import type { CategoryDocument } from './schemas/category.schema';

export interface CategoryWithSubCategory extends CategoryDocument {
  subCategories: CategoryDocument[];
}

export interface CategoryTreeItem extends CategoryDocument {
  subCategories: CategoryTreeItem[];
}
