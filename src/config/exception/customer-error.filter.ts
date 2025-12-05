import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from './custom.error';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {

  catch(error: CustomError, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let mc = error.messageCode;
    response.status(mc.status ? mc.status : HttpStatus.INTERNAL_SERVER_ERROR);

    return response.json(mc);
  }
}