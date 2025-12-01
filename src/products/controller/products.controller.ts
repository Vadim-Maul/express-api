import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { TYPES } from '../../types';
import { IProductService } from '../service/product.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '../../common/auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { IProductsController } from './products.interface';
import { ILogger } from '../../logger/logger.interface';
import { HttpError } from '../../errors/http-error.class';

@injectable()
export class ProductsController extends BaseController implements IProductsController {
	constructor(
		@inject(TYPES.ProductService) private productService: IProductService,
		@inject(TYPES.ILogger) loggerService: ILogger,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/products',
				func: this.create,
				middlewares: [
					new AuthGuard(),
					new RolesGuard(['ADMIN']),
					new ValidateMiddleware(CreateProductDto),
				],
			},
			{
				method: 'get',
				path: '/products',
				func: this.list,
				middlewares: [],
			},
			{
				method: 'get',
				path: '/products/:id',
				func: this.getById,
				middlewares: [],
			},
			{
				method: 'put',
				path: '/products/:id',
				func: this.update,
				middlewares: [
					new AuthGuard(),
					new RolesGuard(['ADMIN']),
					new ValidateMiddleware(UpdateProductDto),
				],
			},
			{
				method: 'delete',
				path: '/products/:id',
				func: this.remove,
				middlewares: [new AuthGuard(), new RolesGuard(['ADMIN'])],
			},
		]);
	}

	async create(
		{ body }: Request<object, object, CreateProductDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const created = await this.productService.create(body);
		if (!created) {
			return next(new HttpError(500, 'Product creation failed'));
		}
		this.ok(res, created);
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		const items = await this.productService.findAll();
		if (!items) {
			return next(new HttpError(500, 'Could not retrieve products'));
		}
		this.ok(res, items);
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(req.params.id);
		const item = await this.productService.findById(id);
		if (!item) {
			return next(new HttpError(404, 'Product not found'));
		}
		this.ok(res, item);
	}

	async update({ params, body }: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(params.id);
		const updated = await this.productService.update(id, body);
		if (!updated) {
			return next(new HttpError(401, 'Unauthorized', 'login'));
		}
		this.ok(res, updated);
	}

	async remove({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		const id = Number(params.id);
		const ok = await this.productService.delete(id);
		if (!ok) {
			return next(new HttpError(404, 'Product not found'));
		}
		this.ok(res, { id });
	}
}
