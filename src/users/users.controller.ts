import { BaseController } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { HttpError } from "../errors/http-error.class";
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
    next(new HttpError(401, "Unauthorized", "login"));
  }
  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, { message: "Registration successful" });
  }
}
