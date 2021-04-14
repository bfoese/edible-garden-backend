import { AddressDto } from '@eg-presentation-facade/seed-sharing-offer/dto/address.dto';
import { PhoneNumberDto } from '@eg-presentation-facade/seed-sharing-offer/dto/phone-number.dto';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class SeedSharingAccountDto {
  @ApiProperty({
    type: 'string',
  })
  @Field(() => ID)
  public userId: string;

  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public username: string;

  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public email: string;

  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public preferredLocale: string;

  @ApiProperty({
    type: AddressDto,
  })
  @Field(() => AddressDto, { nullable: true })
  public address: AddressDto;

  @ApiProperty({
    type: PhoneNumberDto,
  })
  @Field(() => PhoneNumberDto, { nullable: true })
  public phoneNumber: PhoneNumberDto;
}
