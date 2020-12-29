import { ApiProperty } from '@nestjs/swagger';

export class EntityInfoDto {
  public id: string;

  public isActive: boolean;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2018-11-21T06:20:32.232Z' })
  public deleted: Date;

  public version: number;
}
