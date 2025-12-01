import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const secret = this.configService.get('JWT_SECRET');
			const token = authHeader.split(' ')[1];
			if (!secret) {
				res.status(500).json({ message: 'Server config error' });
				return;
			}
			verify(token, secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload === 'object' && 'email' in payload) {
					req.user = {
						email: payload.email as string,
						id: Number(payload.sub),
						role: payload.role,
					};
					next();
				}
			});
		} else {
			next();
		}
	}
}
