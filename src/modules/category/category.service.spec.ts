/* eslint-disable @typescript-eslint/no-use-before-define */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import type { Model } from 'mongoose';

import { CategoryService } from './category.service';
import { Category } from './schemas/category.schema';

describe('CategoryService', () => {
  let model: Model<Category>;

  let service: CategoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    model = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCategoryTreeV2', async () => {
    jest.spyOn(model, 'aggregate').mockResolvedValue(mockCategories);
    const categories = await service.getCategoryTreeV2();
    expect(categories).toEqual(mockCategoryTree);
  });
});

const mockCategories = [
  {
    _id: '63404f188f87385d2d95c882',
    name: 'Женщинам',
    path: 'womens',
    parent: null,
    ancestors: [],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c887',
    name: 'Одежда',
    path: 'womens/clothes',
    parent: '63404f188f87385d2d95c882',
    ancestors: ['63404f188f87385d2d95c882'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c899',
    name: 'Верхняя одежда',
    path: 'womens/clothes/outerwear',
    parent: '63404f188f87385d2d95c887',
    ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c8ea',
    name: 'Анораки',
    path: 'womens/clothes/outerwear/anoraks',
    parent: '63404f188f87385d2d95c899',
    ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c8eb',
    name: 'Бомберы',
    path: 'womens/clothes/outerwear/bomber-jackets',
    parent: '63404f188f87385d2d95c899',
    ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c8ec',
    name: 'Джинсовые куртки',
    path: 'womens/clothes/outerwear/denim-jackets',
    parent: '63404f188f87385d2d95c899',
    ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c883',
    name: 'Мужчинам',
    path: 'mens',
    parent: null,
    ancestors: [],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c88a',
    name: 'Одежда',
    path: 'mens/clothes',
    parent: '63404f188f87385d2d95c883',
    ancestors: ['63404f188f87385d2d95c883'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c8c2',
    name: 'Верхняя одежда',
    path: 'mens/clothes/outerwear',
    parent: '63404f188f87385d2d95c88a',
    ancestors: ['63404f188f87385d2d95c883', '63404f188f87385d2d95c88a'],
    subCategories: [],
  },
  {
    _id: '63404f198f87385d2d95c959',
    name: 'Анораки',
    path: 'mens/clothes/outerwear/anoraks',
    parent: '63404f188f87385d2d95c8c2',
    ancestors: ['63404f188f87385d2d95c883', '63404f188f87385d2d95c88a', '63404f188f87385d2d95c8c2'],
    subCategories: [],
  },
  {
    _id: '63404f188f87385d2d95c884',
    name: 'Детям',
    path: 'kids',
    parent: null,
    ancestors: [],
    subCategories: [],
  },
];

const mockCategoryTree = [
  {
    _id: '63404f188f87385d2d95c882',
    name: 'Женщинам',
    path: 'womens',
    parent: null,
    ancestors: [],
    subCategories: [
      {
        _id: '63404f188f87385d2d95c887',
        name: 'Одежда',
        path: 'womens/clothes',
        parent: '63404f188f87385d2d95c882',
        ancestors: ['63404f188f87385d2d95c882'],
        subCategories: [
          {
            _id: '63404f188f87385d2d95c899',
            name: 'Верхняя одежда',
            path: 'womens/clothes/outerwear',
            parent: '63404f188f87385d2d95c887',
            ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887'],
            subCategories: [
              {
                _id: '63404f188f87385d2d95c8ea',
                name: 'Анораки',
                path: 'womens/clothes/outerwear/anoraks',
                parent: '63404f188f87385d2d95c899',
                ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
                subCategories: [],
              },
              {
                _id: '63404f188f87385d2d95c8eb',
                name: 'Бомберы',
                path: 'womens/clothes/outerwear/bomber-jackets',
                parent: '63404f188f87385d2d95c899',
                ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
                subCategories: [],
              },
              {
                _id: '63404f188f87385d2d95c8ec',
                name: 'Джинсовые куртки',
                path: 'womens/clothes/outerwear/denim-jackets',
                parent: '63404f188f87385d2d95c899',
                ancestors: ['63404f188f87385d2d95c882', '63404f188f87385d2d95c887', '63404f188f87385d2d95c899'],
                subCategories: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    _id: '63404f188f87385d2d95c883',
    name: 'Мужчинам',
    path: 'mens',
    parent: null,
    ancestors: [],
    subCategories: [
      {
        _id: '63404f188f87385d2d95c88a',
        name: 'Одежда',
        path: 'mens/clothes',
        parent: '63404f188f87385d2d95c883',
        ancestors: ['63404f188f87385d2d95c883'],
        subCategories: [
          {
            _id: '63404f188f87385d2d95c8c2',
            name: 'Верхняя одежда',
            path: 'mens/clothes/outerwear',
            parent: '63404f188f87385d2d95c88a',
            ancestors: ['63404f188f87385d2d95c883', '63404f188f87385d2d95c88a'],
            subCategories: [
              {
                _id: '63404f198f87385d2d95c959',
                name: 'Анораки',
                path: 'mens/clothes/outerwear/anoraks',
                parent: '63404f188f87385d2d95c8c2',
                ancestors: ['63404f188f87385d2d95c883', '63404f188f87385d2d95c88a', '63404f188f87385d2d95c8c2'],
                subCategories: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    _id: '63404f188f87385d2d95c884',
    name: 'Детям',
    path: 'kids',
    parent: null,
    ancestors: [],
    subCategories: [],
  },
];
