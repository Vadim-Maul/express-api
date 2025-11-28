import express, { Express } from "express";
import { Server } from "http";
import { UsersController } from "./users/users.controller";
import { injectable, inject } from "inversify";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./errors/exeption.filter.interface";

@injectable()
export class App {
  app: Express;
  server!: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UsersController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter
  ) {
    this.app = express();
    this.port = process.env.PORT ? Number(process.env.PORT) : 3000;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  useRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server is running on http://localhost:${this.port}`);
  }
}
