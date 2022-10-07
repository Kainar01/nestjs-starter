import type { Db } from 'mongodb';
import { SchemaName } from '../../common/interfaces/schema';

export = {
  async up(db: Db) {
    await db.collection(SchemaName.CATEGORY).createIndexes([
      { name: 'category_name', key: { name: 1 } },
      { name: 'category_path', unique: true, key: { path: 1 } },
      { name: 'category_order', key: { order: 1 } },
    ]);
  },

  async down(db: Db) {
    await db.collection(SchemaName.CATEGORY).dropIndex('category_name');
    await db.collection(SchemaName.CATEGORY).dropIndex('category_path');
    await db.collection(SchemaName.CATEGORY).dropIndex('category_order');
  },
};
