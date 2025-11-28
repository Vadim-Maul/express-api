import { inject, injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { IUserService } from './user.service.interface';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	async createUser({ email, username, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, username);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		// check if user already exists in DB (omitted)
		// if not, create and save the user (omitted)
		// if created send back the user
		// else return null
		return null;
	}

	async validateUser(dto: UserRegisterDto): Promise<boolean> {
		return true;
	}
}
