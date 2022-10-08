import { OmitType } from '@nestjs/mapped-types';
import { CategoryResponseDto } from './category.response.dto';

export class CreateCategoryRequestDto extends OmitType(CategoryResponseDto, ['_id', 'ancestors']) {}
