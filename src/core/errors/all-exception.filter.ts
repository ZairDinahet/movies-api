import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

type ExceptionResponse = {
  message?: string | string[];
  error?: string;
  [key: string]: any;
};
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDev = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];
    let errorStack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        messages = [exceptionResponse];
      } else {
        const responseObj = exceptionResponse as ExceptionResponse;

        if (Array.isArray(responseObj.message)) {
          messages = responseObj.message;
        } else if (typeof responseObj.message === 'string') {
          messages = [responseObj.message];
        } else if (typeof responseObj.error === 'string') {
          messages = [responseObj.error];
        } else {
          messages = [exception.message || 'Unexpected error'];
        }
      }
    } else if (exception instanceof Error) {
      messages = [exception.message];
      errorStack = exception.stack;
    }

    this.logger.error(
      `[${request.method}] ${request.url} -> ${status} | ${messages.join(', ')}`,
      this.isDev && errorStack ? errorStack : undefined,
    );

    const jsonResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: messages.length === 1 ? messages[0] : messages,
      ...(this.isDev && errorStack ? { stack: errorStack } : {}),
    };

    response.status(status).json(jsonResponse);
  }
}
