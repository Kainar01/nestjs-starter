import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { CategoryDto } from "./category.dto";

export class CategoryTreeResponseDto extends CategoryDto {
  @ApiProperty({
    allOf: [{ $ref: getSchemaPath(CategoryTreeResponseDto) }],
    type: [CategoryTreeResponseDto],
  })
  subCategories!: CategoryTreeResponseDto[];
}
