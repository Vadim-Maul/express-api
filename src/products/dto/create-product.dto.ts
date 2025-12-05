import { IsDecimal, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
	@IsString()
	name!: string;
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price!: number;
	@IsString()
	@IsOptional()
	description?: string;
	@IsString()
	image!: string;
	@IsNumber()
	@Min(1)
	@IsOptional()
	rating?: number;
	@IsNumber()
	@Min(1)
	@IsOptional()
	heatLevel?: number;
	@IsNumber()
	@Min(1)
	@IsOptional()
	type?: number;
}
