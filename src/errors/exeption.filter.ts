import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { IExceptionFilter } from "./exeption.filter.interface";
import { HttpError } from "./http-error.class";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
  catch(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof HttpError) {
      this.logger.error(
        `[${err.context}]: [status] : ${err.statusCode} : [message] : ${err.message}`
      );
      res.status(err.statusCode).json({ error: err.message });
    } else {
      this.logger.error(`[ExceptionFilter]: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  }
}
