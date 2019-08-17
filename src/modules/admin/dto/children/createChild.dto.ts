import {
  IsNotEmpty,
  IsEnum,
  IsNumberString,
  IsDateString,
} from 'class-validator';

enum Gender {
  Male = 'male',
  Female = 'female',
}
export class CreateChildDTO {
  @IsNotEmpty() readonly firstName: any;
  @IsNotEmpty() readonly lastName: any;
  @IsDateString() readonly dateOfBirth: any;
  @IsNumberString() readonly grade: any;
  @IsNotEmpty() readonly story: any;
  @IsEnum(Gender) readonly gender: any;
  @IsNumberString() readonly sponsorsNeeded: any;
}
