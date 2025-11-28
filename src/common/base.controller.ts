import { Router, Response } from 'express';

import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, statusCode: number, data: T): ExpressReturnType {
		res.type('application/json');
		return res.status(statusCode).json(data);
	}

	public ok<T>(res: Response, data: T): ExpressReturnType {
		return this.send<T>(res, 200, data);
	}

	public created<T>(res: Response, data: T): ExpressReturnType {
		return this.send<T>(res, 201, data);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const boundRoute = route.func.bind(this);
			this.logger.log(
				`Binding route [${route.method.toUpperCase()}] ${
					route.path
				} to controller ${this.constructor.name}`,
			);
			const middlewares = route.middlewares?.map((middleware) =>
				middleware.execute.bind(middleware),
			);
			const pipeline = middlewares ? [...middlewares, boundRoute] : [boundRoute];
			this.router[route.method](route.path, ...pipeline);
		}
	}
}
