import {
  IsNotEmpty,
  IsEnum,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { Expose } from 'class-transformer';

enum Gender {
  Male = 'male',
  Female = 'female',
}
export class UpdateChildDTO {
  @Expose() readonly id: number;
  @Expose() readonly firstName: any;
  @Expose() readonly lastName: any;
  @Expose() readonly dateOfBirth: any;
  @Expose() readonly grade: any;
  @Expose() readonly story: any;
  @Expose() readonly gender: any;
  @Expose() readonly sponsorsNeeded: any;
}
