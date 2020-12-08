import { BotanicalSpeciesDto } from '@eg-botanical-species/dto/botanical-species.dto';
import { CreateBotanicalSpeciesDto } from '@eg-botanical-species/dto/create-botanical-species.dto';
import { UpdateBotanicalSpeciesDto } from '@eg-botanical-species/dto/update-botanical-species.dto';
import { BotanicalSpeciesEntity } from '@eg-botanical-species/entity/botanical-species.entity';
import { BotanicalSpeciesService } from '@eg-botanical-species/service/botanical-species.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

@Controller('v1/botanical-species')
export class BotanicalSpeciesController {
  public constructor(private readonly botanicalSpeciesService: BotanicalSpeciesService) {}

  @Post()
  public create(@Body() createBotanicalSpeciesDto: CreateBotanicalSpeciesDto): Promise<Partial<BotanicalSpeciesDto>> {
    return this.botanicalSpeciesService.create(createBotanicalSpeciesDto);
  }

  @Get()
  public findAll(): Promise<BotanicalSpeciesEntity[]> {
    return this.botanicalSpeciesService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<BotanicalSpeciesEntity> {
    return this.botanicalSpeciesService.findOne(id);
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateBotanicalSpeciesDto: UpdateBotanicalSpeciesDto
  ): Promise<BotanicalSpeciesEntity> {
    return this.botanicalSpeciesService.update(id, updateBotanicalSpeciesDto);
  }

  @Put(':id/recover')
  public recover(@Param('id') id: string): Promise<boolean> {
    return this.botanicalSpeciesService.recover(id).then((result: UpdateResult) => result && result.affected > 0);
  }

  @Delete(':id')
  public softDelete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalSpeciesService.softDelete(id).then((result: UpdateResult) => result && result.affected > 0);
  }

  @Delete(':id/deleted')
  public delete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalSpeciesService.delete(id).then((result: UpdateResult) => result && result.affected > 0);
  }
}
