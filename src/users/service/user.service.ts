import { inject, injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { IUserRepository } from '../repository/users.repository.interface';
import { UserModel } from '../../generated/prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { sign, verify } from 'jsonwebtoken';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}
	async createUser({ email, username, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, username);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.username, existedUser.password);
		return newUser.comparePassword(password);
	}

	private signAccess(email: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Number(this.configService.get('ACCESS_TOKEN_EXPIRES_IN')) },
				this.configService.get('JWT_SECRET'),
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}

	private signRefresh(userId: number): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ userId, iat: Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN')) },
				this.configService.get('REFRESH_SECRET'),
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}

	async issueTokens(email: string): Promise<{ access: string; refresh: string } | null> {
		const user = await this.userRepository.find(email);
		if (!user) return null;
		const access = await this.signAccess(user.email);
		const refresh = await this.signRefresh(user.id);
		await this.userRepository.updateRefreshToken(user.id, refresh);
		return { access, refresh };
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		const user = await this.userRepository.find(email);
		if (!user) return null;
		return user;
	}

	async rotateRefresh(oldRefresh: string): Promise<{ access: string; refresh: string } | null> {
		const user = await this.userRepository.findByRefreshToken(oldRefresh);
		if (!user) return null;
		try {
			verify(oldRefresh, this.configService.get('REFRESH_SECRET'));
		} catch {
			return null;
		}
		const access = await this.signAccess(user.email);
		const refresh = await this.signRefresh(user.id);
		await this.userRepository.updateRefreshToken(user.id, refresh);
		return { access, refresh };
	}

	async logout(refreshToken: string): Promise<boolean> {
		const user = await this.userRepository.findByRefreshToken(refreshToken);
		if (!user) return false;
		await this.userRepository.updateRefreshToken(user.id, null);
		return true;
	}
}
