import { PartialType } from '@nestjs/mapped-types';
import { CreateBotanicalFamilyDto } from './create-botanical-family.dto';

export class UpdateBotanicalFamilyDto extends PartialType(
  CreateBotanicalFamilyDto,
) {}
