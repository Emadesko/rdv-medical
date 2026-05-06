// core/utils/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { RestResponse } from '../../dto/rest.response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      if (
        typeof exceptionResponse === 'object' &&
        !('message' in exceptionResponse)
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new RestResponse(
              HttpStatus.BAD_REQUEST,
              exceptionResponse,
              'Données invalides',
            ),
          );
      }
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return res
        .status(status)
        .json(
          new RestResponse(
            status,
            exception.message,
            exception.constructor.name,
          ),
        );
    }

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new RestResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
          'ServerError',
        ),
      );
  }
}
