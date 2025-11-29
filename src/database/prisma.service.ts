import { inject, injectable } from 'inversify';
import { PrismaClient } from '../generated/prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { PrismaPg } from '@prisma/adapter-pg';
import { IConfigService } from '../config/config.service.interface';
import { Pool } from 'pg';

@injectable()
export class PrismaService {
	client: PrismaClient;
	adapter: PrismaPg;
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		const pool = new Pool({ connectionString: this.configService.getOrThrow('DATABASE_URL') });
		this.adapter = new PrismaPg(pool);
		this.client = new PrismaClient({ adapter: this.adapter });
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('Connected to the database');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Database connection error: ${error.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
