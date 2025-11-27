import { Router, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IControllerRoute } from "./route.interface";

export abstract class BaseController {
  private readonly _router: Router;
  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, statusCode: number, data: T): Response<T> {
    res.type("application/json");
    return res.status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): Response<T> {
    return this.send<T>(res, 200, data);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      const boundRoute = route.func.bind(this);
      this.logger.log(
        `Binding route [${route.method.toUpperCase()}] ${
          route.path
        } to controller ${this.constructor.name}`
      );
      this.router[route.method](route.path, boundRoute);
    }
  }
}
