import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
}
