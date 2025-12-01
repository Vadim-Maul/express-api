import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';

export class RolesGuard implements IMiddleware {
	constructor(private allowed: Array<'USER' | 'ADMIN'>) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		const role = req.user?.role || 'USER';
		if (this.allowed.includes(role as 'USER' | 'ADMIN')) {
			return next();
		}
		res.status(403).json({ message: 'Forbidden' });
	}
}
