import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty()
  readonly isArchived: boolean;

  @ApiProperty()
  readonly created: Date;

  @ApiProperty()
  readonly lastChanged: Date;

  @ApiProperty()
  readonly version: number;
}
