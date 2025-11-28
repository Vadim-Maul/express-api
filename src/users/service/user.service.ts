import { inject, injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { IUserRepository } from '../repository/users.repository.interface';
import { UserModel } from '../../generated/prisma/client';

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

	async validateUser(dto: UserRegisterDto): Promise<boolean> {
		return true;
	}
}
