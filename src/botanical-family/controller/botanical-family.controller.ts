import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { BotanicalFamilyEntity } from 'src/botanical-family/entity/botanical-family.entity';
import { UpdateResult } from 'typeorm';
import { CreateBotanicalFamilyDto } from '../dto/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from '../dto/update-botanical-family.dto';
import { BotanicalFamilyService } from '../service/botanical-family.service';

@Controller('v1/botanical-family')
export class BotanicalFamilyController {
  constructor(
    private readonly botanicalFamilyService: BotanicalFamilyService
  ) {}

  @Post()
  create(
    @Body() createBotanicalFamilyDto: CreateBotanicalFamilyDto
  ): Promise<BotanicalFamilyEntity> {
    return this.botanicalFamilyService.create(createBotanicalFamilyDto);
  }

  @Get()
  findAll() {
    return this.botanicalFamilyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botanicalFamilyService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBotanicalFamilyDto: UpdateBotanicalFamilyDto
  ) {
    return this.botanicalFamilyService.update(id, updateBotanicalFamilyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService
      .softDelete(id)
      .then((result: UpdateResult) => result && result.affected > 0);
  }
}
