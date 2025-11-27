import { NextFunction, Request, Response } from "express";
import { IExceptionFilter } from "./exeption.filter.interface";
import { LoggerService } from "../logger/logger.service";
import { HttpError } from "./http-error.class";

export class ExceptionFilter implements IExceptionFilter {
  private logger: LoggerService;
  constructor(logger: LoggerService) {
    this.logger = logger;
  }
  catch(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof HttpError) {
      this.logger.error(
        `[${err.context}]: status : ${err.statusCode} : message : ${err.message}`
      );
      res.status(err.statusCode).json({ error: err.message });
    } else {
      this.logger.error(`[ExceptionFilter]: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
