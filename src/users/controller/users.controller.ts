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
import { IConfigService } from '../../config/config.service.interface';
import { RefreshDto } from '../dto/user-refresh.dto';
import { AuthGuard } from '../../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				method: 'post',
				path: '/refresh',
				func: this.refresh,
				middlewares: [new ValidateMiddleware(RefreshDto)],
			},
			{
				method: 'post',
				path: '/logout',
				func: this.logout,
				middlewares: [new ValidateMiddleware(RefreshDto)],
			},
			{
				method: 'get',
				path: '/info',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async login(
		{ body }: Request<object, object, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Unauthorized', 'login'));
		}
		const tokens = await this.userService.issueTokens(body.email);
		this.ok(res, tokens as { access: string; refresh: string });
	}

	async logout(
		{ body }: Request<object, object, RefreshDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const ok = await this.userService.logout(body.refreshToken);
		if (!ok) {
			return next(new HttpError(400, 'Logout failed', 'logout'));
		}
		this.ok(res, { message: 'Logged out successfully' });
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

	async refresh(
		{ body }: Request<object, object, RefreshDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const rotated = await this.userService.rotateRefresh(body.refreshToken);
		if (!rotated) {
			return next(new HttpError(401, 'Invalid refresh token', 'refresh'));
		}
		this.ok(res, rotated);
	}
	async info(
		{ user }: Request<object, object, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user!.email);

		this.ok(res, { email: userInfo?.email, username: userInfo?.username, id: userInfo?.id });
	}
}
