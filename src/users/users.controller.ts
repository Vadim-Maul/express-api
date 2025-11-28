import { BaseController } from "../common/base.controller";
import { IControllerRoute } from "../common/route.interface";
import { HttpError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { IUserController } from "./users.controller.interface";
import { NextFunction, Request, Response } from "express";
import { TYPES } from "../types";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController extends BaseController implements IUserController {
  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    super(loggerService);
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
