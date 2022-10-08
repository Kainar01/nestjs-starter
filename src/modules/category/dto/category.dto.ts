import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  @ApiProperty()
  name!: string;

  @IsString()
  @ApiProperty()
  path!: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  order?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true })
  parent?: string | null;
}
