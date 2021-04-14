import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType('PhoneNumberType')
@InputType('PhoneNumberInput')
export class PhoneNumberDto {
  @ApiProperty({
    type: 'string',
  })
  @Field({ nullable: true })
  public phoneNo: string;

  @ApiProperty({
    type: 'string',
    minLength: 2,
    maxLength: 2,
  })
  @Field({ nullable: true })
  public countryCode: number;
}
