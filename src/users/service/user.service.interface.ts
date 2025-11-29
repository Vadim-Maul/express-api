import { UserModel } from '../../generated/prisma/browser';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	issueTokens: (email: string) => Promise<{ access: string; refresh: string } | null>;
	rotateRefresh: (oldRefresh: string) => Promise<{ access: string; refresh: string } | null>;
	logout: (refreshToken: string) => Promise<boolean>;
}
