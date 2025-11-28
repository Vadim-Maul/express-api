import { UserModel } from '../../generated/prisma/client';
import { User } from '../entity/user.entity';

export interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
