import { UserModel } from '../../generated/prisma/browser';
import { UserRegisterDto } from '../dto/user-register.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserRegisterDto) => Promise<boolean>;
}
