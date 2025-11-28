import { inject, injectable } from 'inversify';
import { UserModel } from '../../generated/prisma/client';
import { User } from '../entity/user.entity';
import { IUserRepository } from './users.repository.interface';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class UsersRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, username, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				username,
				password,
			},
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findUnique({
			where: {
				email,
			},
		});
	}
}
