import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';

import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/category.schema';

describe('CategoryService', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let categoryModel: Model<Category>;

  let service: CategoryService;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    categoryModel = mongoConnection.model(Category.name, CategorySchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, { provide: getModelToken(Category.name), useValue: categoryModel }],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });
});
