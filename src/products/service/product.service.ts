import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IProductsRepository } from '../repository/products.repository.interface';
import { IProductService } from './product.service.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductModel } from '../../generated/prisma/client';
import { Product } from '../entity/product.entity';

@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.ProductsRepository) private repo: IProductsRepository) {}

	async create(dto: CreateProductDto): Promise<ProductModel> {
		const entity = new Product(dto.name, Number(dto.price), dto.description);
		return this.repo.create(entity);
	}

	async findById(id: number): Promise<ProductModel | null> {
		return this.repo.findById(id);
	}

	async findAll(): Promise<ProductModel[]> {
		return this.repo.findAll();
	}

	async update(id: number, dto: UpdateProductDto): Promise<ProductModel | null> {
		const existed = await this.repo.findById(id);
		if (!existed) return null;
		return this.repo.update(id, dto);
	}

	async delete(id: number): Promise<boolean> {
		const existed = await this.repo.findById(id);
		if (!existed) return false;
		await this.repo.delete(id);
		return true;
	}
}
