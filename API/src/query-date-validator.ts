import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(date: string) {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!regex.test(date)) {
      return false;
    }

    const [year, month, day] = date.split('/').map(Number);
    if (year > 2024 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Date must be in the format YYYY/MM/DD, with a valid month (1-12), valid day (1-31), and year <= 2024. Yours was: ${args.value}`;
  }
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateConstraint,
    });
  };
}
