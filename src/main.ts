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
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/repository/users.repository';
import { IUserRepository } from './users/repository/users.repository.interface';
import { ProductsRepository } from './products/repository/products.repository';
import { IProductsRepository } from './products/repository/products.repository.interface';
import { ProductService } from './products/service/product.service';
import { IProductService } from './products/service/product.service.interface';
import { ProductsController } from './products/controller/products.controller';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind) => {
	bind.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind.bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind.bind<IUserController>(TYPES.UserController).to(UsersController).inSingletonScope();
	bind.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind.bind<IUserRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope();
	bind
		.bind<IProductsRepository>(TYPES.ProductsRepository)
		.to(ProductsRepository)
		.inSingletonScope();
	bind.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
	bind.bind<ProductsController>(TYPES.ProductsController).to(ProductsController).inSingletonScope();
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
