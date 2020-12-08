import { BotanicalFamilyService } from '@eg-data-access/botanical-family/service/botanical-family.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BotanicalFamilyDto } from 'src/types-api/botanical-family/botanical-family.dto';
import { CreateBotanicalFamilyDto } from 'src/types-api/botanical-family/create-botanical-family.dto';
import { UpdateBotanicalFamilyDto } from 'src/types-api/botanical-family/update-botanical-family.dto';

@Controller('v1/botanical-family')
export class BotanicalFamilyController {
  public constructor(private readonly botanicalFamilyService: BotanicalFamilyService) {}

  @Post()
  public create(@Body() createBotanicalFamilyDto: CreateBotanicalFamilyDto): Observable<Partial<BotanicalFamilyDto>> {
    return this.botanicalFamilyService.create(createBotanicalFamilyDto);
  }

  @Get()
  public findAll(): Observable<Partial<BotanicalFamilyDto>[]> {
    return this.botanicalFamilyService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<Partial<BotanicalFamilyDto>> {
    return this.botanicalFamilyService.findOne(id);
  }

  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateBotanicalFamilyDto: UpdateBotanicalFamilyDto
  ): Observable<Partial<BotanicalFamilyDto>> {
    return this.botanicalFamilyService.update(id, updateBotanicalFamilyDto);
  }

  @Put(':id/recover')
  public recover(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.recover(id);
  }

  @Delete(':id')
  public softDelete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.softDelete(id);
  }

  @Delete(':id/deleted')
  public delete(@Param('id') id: string): Promise<boolean> {
    return this.botanicalFamilyService.delete(id);
  }
}
