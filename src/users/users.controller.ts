import { BaseController } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { LoggerService } from "../logger/logger.service";
import { NextFunction, Request, Response } from "express";

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      {
        method: "post",
        path: "/login",
        func: this.login,
      },
      {
        method: "post",
        path: "/register",
        func: this.register,
      },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, { message: "Login successful" });
  }
  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, { message: "Registration successful" });
  }
}
