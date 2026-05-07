import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueServiceValidator } from './unique-service.validator';

export function IsServiceUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueServiceValidator,
    });
  };
}
