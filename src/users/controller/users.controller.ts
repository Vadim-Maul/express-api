import { BaseController } from '../../common/base.controller';
import { HttpError } from '../../errors/http-error.class';
import { ILogger } from '../../logger/logger.interface';
import { IUserController } from './users.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { TYPES } from '../../types';
import { inject, injectable } from 'inversify';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { IUserService } from '../service/user.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/login',
				func: this.login,
			},
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	login(req: Request<object, object, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);

		next(new HttpError(401, 'Unauthorized', 'login'));
	}
	async register(
		{ body }: Request<object, object, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'Cannot create user or user already exists', 'register'));
		}
		this.ok(res, { email: result.email, username: result.username, id: result.id });
	}
}
