import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueSpecialiteValidator } from './unique-specialite.validator';

export function IsSpecialiteUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueSpecialiteValidator,
    });
  };
}
