import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import { IConfigService } from './config.service.interface.js';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput = {};
	private readonly envConfig: { [key: string]: string | undefined };
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Cannot read .env file or it is missing!');
		} else {
			this.logger.log('[ConfigService] .env file successfully loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return process.env[key] ?? this.config[key];
	}
}
