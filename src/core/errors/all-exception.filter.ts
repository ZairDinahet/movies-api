import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDev = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : typeof res === 'object' &&
              'message' in res &&
              typeof res.message === 'string'
            ? res.message
            : exception.message;
    }

    if (exception instanceof Error) {
      error = exception.stack;
    }

    this.logger.error(
      `[${request.method}] ${request.url} -> ${status} | ${message}`,
      this.isDev && error ? error : undefined,
    );

    const jsonResponse: {
      statusCode: number;
      timestamp: string;
      path: string;
      method: string;
      message: string;
      stack?: string;
    } = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    if (this.isDev && error) {
      jsonResponse.stack = error;
    }

    response.status(status).json(jsonResponse);
  }
}
