import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { TYPES } from '../../types';
import { IProductsRepository } from './products.repository.interface';
import { ProductModel } from '../../generated/prisma/client';
import { Product } from '../entity/product.entity';

@injectable()
export class ProductsRepository implements IProductsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({
		name,
		price,
		description,
		image,
		rating,
		heatLevel,
		type,
	}: Product): Promise<ProductModel> {
		return this.prismaService.client.productModel.create({
			data: { name, price, description, image, rating, heatLevel, type },
		});
	}

	async findById(id: number): Promise<ProductModel | null> {
		return this.prismaService.client.productModel.findUnique({ where: { id } });
	}

	async findAll(): Promise<ProductModel[]> {
		return this.prismaService.client.productModel.findMany({ orderBy: { createdAt: 'desc' } });
	}

	async update(id: number, { name, price, description }: Partial<Product>): Promise<ProductModel> {
		return this.prismaService.client.productModel.update({
			where: { id },
			data: { name, price, description },
		});
	}

	async delete(id: number): Promise<void> {
		await this.prismaService.client.productModel.delete({ where: { id } });
	}
}
