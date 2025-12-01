import { ProductModel } from '../../generated/prisma/client';
import { Product } from '../entity/product.entity';

export interface IProductsRepository {
	create: (product: Product) => Promise<ProductModel>;
	findById: (id: number) => Promise<ProductModel | null>;
	findAll: () => Promise<ProductModel[]>;
	update: (id: number, product: Partial<Product>) => Promise<ProductModel>;
	delete: (id: number) => Promise<void>;
}
