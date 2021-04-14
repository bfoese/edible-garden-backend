import { AddressDto } from '@eg-presentation-facade/seed-sharing-offer/dto/address.dto';
import { PhoneNumberDto } from '@eg-presentation-facade/seed-sharing-offer/dto/phone-number.dto';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class PatchSeedSharingAccountDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @Field({ nullable: true })
  public preferredLocale: string;

  @ApiProperty({
    type: AddressDto,
    required: false,
  })
  @Field(() => AddressDto, { nullable: true })
  public address: AddressDto;

  @ApiProperty({
    type: PhoneNumberDto,
    required: false,
  })
  @Field(() => PhoneNumberDto, { nullable: true })
  public phoneNumber: PhoneNumberDto;
}
