import { ApiProperty } from '@nestjs/swagger';

export class NutritionDemandDto {
  @ApiProperty({
    minimum: 1,
    exclusiveMinimum: false,
    maximum: 3,
    exclusiveMaximum: false,
  })
  public value: number;
}
