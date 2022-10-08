import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { CategoryResponseDto } from "./category.response.dto";

export class CategoryTreeResponseDto extends CategoryResponseDto {
  @ApiProperty({
    allOf: [{ $ref: getSchemaPath(CategoryTreeResponseDto) }],
    type: [CategoryTreeResponseDto],
  })
  subCategories!: CategoryTreeResponseDto[];
}
