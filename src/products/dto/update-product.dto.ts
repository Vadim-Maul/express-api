import { IsDecimal, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
	@IsString()
	@IsOptional()
	name?: string;
	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@IsOptional()
	price?: number;
	@IsString()
	@IsOptional()
	description?: string;
}
