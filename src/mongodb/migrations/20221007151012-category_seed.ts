import type { Db } from 'mongodb';
import { SchemaName } from '../../common/interfaces/schema';
import { insertCategoryFixtures } from '../fixtures/category';

export = {
  async up(db: Db) {
    await insertCategoryFixtures(db);
  },

  async down(db: Db) {
    await db.collection(SchemaName.CATEGORY).deleteMany({});
  },
};
