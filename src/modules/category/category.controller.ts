import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Version } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UseCache } from '@/common/decorators/cache.decorator';

import type { CategoryTreeItem } from './category.interface';
import { CategoryService } from './category.service';
import { CategoryTreeResponseDto } from './dto/category-tree.response.dto';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryRequestDto } from './dto/create-category.request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category.request.dto';
import type { Category } from './schemas/category.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @ApiOperation({ description: 'Get category tree' })
  @ApiOkResponse({ type: CategoryTreeResponseDto, isArray: true })
  @Get('tree')
  @UseCache()
  public async getCategoryTree(): Promise<CategoryTreeItem[]> {
    return this.category.getCategoryTree();
  }

  @ApiOperation({ description: 'Get category tree v2' })
  @ApiOkResponse({ type: CategoryTreeResponseDto, isArray: true })
  @Version('2')
  @Get('tree')
  @UseCache()
  public async getCategoryTreeV2(): Promise<CategoryTreeItem[]> {
    return this.category.getCategoryTreeV2();
  }

  @ApiOperation({ description: 'Get category flat list' })
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  @Get('all')
  public async getAllCategories(): Promise<CategoryDto[]> {
    return this.category.getAllCategories();
  }

  @ApiOperation({ description: 'Create category' })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse({ type: CategoryDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createCategory(@Body() dto: CreateCategoryRequestDto): Promise<Category> {
    return this.category.create(dto);
  }

  @ApiOperation({ description: 'Update category' })
  @ApiOkResponse({ type: CategoryDto })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Put(':id')
  public async updateCategory(@Body() dto: UpdateCategoryRequestDto, @Param('id') id: string): Promise<Category | null> {
    return this.category.update(id, dto);
  }
}
