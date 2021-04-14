import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType('AddressType')
@InputType('AddressInput')
export class AddressDto {
  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public line1: string;

  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public postalCode: string;

  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public city: string;

  @ApiProperty({
    type: 'string',
    minLength: 2,
    maxLength: 2,
  })
  @Field({ nullable: true })
  public countryCode: string;
}
