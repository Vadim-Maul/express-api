import { injectable } from "inversify";
import { Logger, ILogObj } from "tslog";
import { ILogger } from "./logger.interface";

@injectable()
export class LoggerService implements ILogger {
  logger: Logger<ILogObj>;

  constructor() {
    const loggerTemplate =
      "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}}: ";
    this.logger = new Logger({
      prettyLogTemplate: loggerTemplate,
    });
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}
