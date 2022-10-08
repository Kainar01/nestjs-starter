import type { CategoryDocument } from './schemas/category.schema';

export interface CategoryTreeItem extends Pick<CategoryDocument, '_id'> {
  subCategories: CategoryTreeItem[];
}
