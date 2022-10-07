import { Body, CacheInterceptor, CacheTTL, Controller, Get, Param, Post, Put, UseInterceptors, Version } from '@nestjs/common';

import type { CategoryTreeItem } from './category.interface';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Category } from './schemas/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @Get('tree')
  @CacheTTL(0)
  @UseInterceptors(CacheInterceptor)
  public async getCategoryTree(): Promise<CategoryTreeItem[]> {
    return this.category.getCategoryTree();
  }

  @Version('2')
  @Get('tree')
  @CacheTTL(0)
  @UseInterceptors(CacheInterceptor)
  public async getCategoryTreeV2(): Promise<CategoryTreeItem[]> {
    return this.category.getCategoryTreeV2();
  }

  @Get('all')
  public async getAllCategories(): Promise<Category[]> {
    return this.category.getAllCategories();
  }

  @Post()
  public async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.category.create(dto);
  }

  @Put(':id')
  public async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<Category | null> {
    return this.category.update(id, dto);
  }
}
