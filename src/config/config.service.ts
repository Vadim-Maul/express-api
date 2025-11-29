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
			this.logger.error(
				'[ConfigService] .env file not found (Production mode OR Docker). Using system env.',
			);
		} else {
			this.logger.log('[ConfigService] .env file loaded and merged.');
			this.envConfig = { ...process.env };
		}
	}

	getOrThrow(key: string): string {
		const value = this.get(key);
		if (value === null) {
			throw new Error(`[ConfigService] Missing env variable: ${key}`);
		}
		return value;
	}

	get(key: string): string | null {
		const value = this.envConfig[key];
		if (value === undefined) {
			this.logger.error(`[ConfigService] Missing env variable: ${key}`);
			return null;
		}
		return value;
	}
}
