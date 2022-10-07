import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Model } from 'mongoose';

import { SchemaName } from '@/common/interfaces/schema';

import type { CategoryTreeItem } from './category.interface';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  public async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  public async getCategoryTree(): Promise<CategoryTreeItem[]> {
    return this.categoryModel.aggregate<CategoryTreeItem>([
      {
        $graphLookup: {
          from: SchemaName.CATEGORY,
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'subCategories',
          maxDepth: 4,
          depthField: 'level',
        },
      },
      {
        $unwind: '$subCategories',
      },
      {
        $sort: { 'subCategories.level': -1 },
      },
      {
        $group: {
          _id: '$_id',
          subCategories: { $push: '$subCategories' },
        },
      },
      {
        $addFields: {
          subCategories: {
            $reduce: {
              input: '$subCategories',
              initialValue: {
                currentLevel: -1,
                currentLevelProjects: [],
                previousLevelProjects: [],
              },
              in: {
                $let: {
                  vars: {
                    prev: {
                      $cond: [
                        { $eq: ['$$value.currentLevel', '$$this.level'] },
                        '$$value.previousLevelProjects',
                        '$$value.currentLevelProjects',
                      ],
                    },
                    current: {
                      $cond: [{ $eq: ['$$value.currentLevel', '$$this.level'] }, '$$value.currentLevelProjects', []],
                    },
                  },
                  in: {
                    currentLevel: '$$this.level',
                    previousLevelProjects: '$$prev',
                    currentLevelProjects: {
                      $concatArrays: [
                        '$$current',
                        [
                          {
                            $mergeObjects: [
                              '$$this',
                              { subCategories: { $filter: { input: '$$prev', as: 'e', cond: { $eq: ['$$e.parent', '$$this._id'] } } } },
                            ],
                          },
                        ],
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: { subCategories: '$subCategories.currentLevelProjects' },
      },
    ]);
  }

  public async getCategoryTreeV2(): Promise<CategoryTreeItem[]> {
    // flat list each element with empty subCategories
    const categories = await this.categoryModel.aggregate<CategoryTreeItem>([{ $addFields: { subCategories: [] } }]);

    // group by parent id, if parent id is null => map to *parentCategoryKey*
    const parentCategoryKey = 'parent';
    const groupedByParent = _.groupBy(categories, (category: CategoryDocument) => category.parent ?? parentCategoryKey);

    const categoriesById = _.keyBy(categories, '_id');

    // loop through categories that have parent
    _.each(_.omit(groupedByParent, parentCategoryKey), (subCategories: CategoryTreeItem[], parentId: string) => {
      categoriesById[parentId].subCategories = subCategories;
    });

    return groupedByParent[parentCategoryKey];
  }

  public async create(dto: CreateCategoryDto): Promise<Category> {
    if (dto.parent) {
      const parentCategory = await this.categoryModel.findOne({ _id: dto.parent });

      if (!parentCategory) throw new BadRequestException('Parent category does not exist');

      return this.categoryModel.create({
        ...dto,
        ancestors: [...parentCategory.ancestors, parentCategory._id],
      });
    }

    return this.categoryModel.create(dto);
  }

  public async update(id: string, dto: UpdateCategoryDto): Promise<Category | null> {
    return this.categoryModel.findOneAndUpdate({ _id: id }, { $set: dto }, { returnDocument: 'after' }).exec();
  }
}
