import { ProductModel } from '../../generated/prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface IProductService {
  create: (dto: CreateProductDto) => Promise<ProductModel>;
  findById: (id: number) => Promise<ProductModel | null>;
  findAll: () => Promise<ProductModel[]>;
  update: (id: number, dto: UpdateProductDto) => Promise<ProductModel | null>;
  delete: (id: number) => Promise<boolean>;
}