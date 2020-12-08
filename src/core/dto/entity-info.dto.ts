import { ApiProperty } from '@nestjs/swagger';

export class EntityInfoDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly isActive: boolean;

  @ApiProperty()
  public readonly deletedAt: Date;

  @ApiProperty()
  public readonly created: Date;

  @ApiProperty()
  public readonly lastChanged: Date;

  @ApiProperty()
  public readonly version: number;
}
