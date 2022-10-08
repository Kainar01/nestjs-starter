import type { Category } from './schemas/category.schema';

export interface CategoryTreeItem extends Category {
  subCategories: CategoryTreeItem[];
}
