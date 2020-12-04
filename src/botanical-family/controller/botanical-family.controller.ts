import { BotanicalFamilyDto } from '@eg-botanical-family/dto/botanical-family.dto';
import { CreateBotanicalFamilyDto } from '@eg-botanical-family/dto/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from '@eg-botanical-family/dto/update-botanical-family.dto';
import { BotanicalFamilyEntity } from '@eg-botanical-family/entity/botanical-family.entity';
import { BotanicalFamilyMapper } from '@eg-botanical-family/mapper/botanical-family.mapper';
import { BotanicalFamilyService } from '@eg-botanical-family/service/botanical-family.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

@Controller('v1/botanical-family')
export class BotanicalFamilyController {
  public constructor(private readonly botanicalFamilyService: BotanicalFamilyService) {}

  @Post()
  public create(@Body() createBotanicalFamilyDto: CreateBotanicalFamilyDto): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyService.create(createBotanicalFamilyDto);
  }

  @Get()
  public findAll(): Promise<BotanicalFamilyEntity[]> {
    return this.botanicalFamilyService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalFamilyDto> {
    return this.botanicalFamilyService.findOne(id).then((entity) => new BotanicalFamilyMapper().toDto(entity));
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateBotanicalFamilyDto: UpdateBotanicalFamilyDto
  ): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyService.update(id, updateBotanicalFamilyDto);
  }

  @Put(':id/recover')
  public recover(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.recover(id).then((result: UpdateResult) => result && result.affected > 0);
  }

  @Delete(':id')
  public softDelete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.softDelete(id).then((result: UpdateResult) => result && result.affected > 0);
  }

  @Delete(':id/deleted')
  public delete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.delete(id).then((result: UpdateResult) => result && result.affected > 0);
  }
}
