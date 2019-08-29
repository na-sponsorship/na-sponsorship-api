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
  readonly firstName: any;
  readonly lastName: any;
  readonly dateOfBirth: any;
  readonly grade: any;
  readonly story: any;
  readonly gender: any;
  readonly sponsorsNeeded: any;
}
