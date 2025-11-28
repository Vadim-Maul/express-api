import { Container, ContainerModule } from 'inversify';
import { App } from './app';

import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { ExceptionFilter } from './errors/exeption.filter';
import { UsersController } from './users/controller/users.controller';
import { IExceptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/controller/users.controller.interface';
import { UserService } from './users/service/user.service';
import { IUserService } from './users/service/user.service.interface';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind) => {
	bind.bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind.bind<IUserService>(TYPES.UserService).to(UserService);
	bind.bind<IUserController>(TYPES.UserController).to(UsersController);
	bind.bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}
export const { appContainer, app } = bootstrap();
