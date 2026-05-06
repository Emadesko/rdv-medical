import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ForbidenException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
