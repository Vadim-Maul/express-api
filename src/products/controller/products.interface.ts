import { NextFunction, Request, Response } from 'express';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductsController {
	list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	create: (
		req: Request<object, object, CreateProductDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	update: (
		{ params, body }: Request<{ id: string }, object, UpdateProductDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	remove: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
