import { ApiProperty } from '@nestjs/swagger';

export class EntityInfoDto {
  public id: string;

  public isActive: boolean;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2018-11-21T06:20:32.232Z' })
  public deleted: Date;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2018-11-21T06:20:32.232Z' })
  public created: Date;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2018-11-21T06:20:32.232Z' })
  public lastChanged: Date;

  public version: number;
}
