import { ILogger } from "../logger/logger.interface";
import { NextFunction, Request, Response } from "express";

export interface IUserController {
  login: (req: Request, res: Response, next: NextFunction) => void;
  register: (req: Request, res: Response, next: NextFunction) => void;
}
