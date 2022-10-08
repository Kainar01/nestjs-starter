/* eslint-disable @typescript-eslint/no-use-before-define */
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryController,
        {
          provide: CategoryService,
          useValue: {
            getCategoryTreeV2: jest.fn().mockResolvedValue(mockCategoryTree),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCategoryTreeV2', async () => {
    jest.spyOn(service, 'getCategoryTreeV2').mockResolvedValue(mockCategoryTree);
    const categories = await controller.getCategoryTreeV2();
    expect(categories).toEqual(mockCategoryTree);
  });
});

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
