import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly isActive: boolean;

  @ApiProperty()
  public readonly isArchived: boolean;

  @ApiProperty()
  public readonly created: Date;

  @ApiProperty()
  public readonly lastChanged: Date;

  @ApiProperty()
  public readonly version: number;
}
