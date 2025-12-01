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
}
