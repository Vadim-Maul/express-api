import { injectable } from 'inversify';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, username, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, username);
		newUser.setPassword(password);
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
