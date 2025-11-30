import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { IUserRepository } from '../repository/users.repository.interface';
import { TYPES } from '../../types';
import { UserService } from './user.service';
import { UserModel } from '../../generated/prisma/browser';
import { User } from '../entity/user.entity';

const container = new Container();

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	create: jest.fn(),
	updateRefreshToken: jest.fn(),
	findByRefreshToken: jest.fn(),
	find: jest.fn(),
};

let configService: IConfigService;
let usersService: IUserService;
let userRepository: IUserRepository;
let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersService = container.get<IUserService>(TYPES.UserService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
});
describe('UserService', () => {
	it('should create a user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce((user: User): Promise<UserModel> => {
			return Promise.resolve({
				id: 1,
				email: user.email,
				username: user.username,
				password: user.password,
				refreshToken: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		});
		createdUser = await usersService.createUser({
			email: 'a@test.com',
			username: 'Test',
			password: 'password123',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.email).toEqual('a@test.com');
		expect(createdUser?.username).toEqual('Test');
		expect(createdUser?.password).not.toEqual('password123');
	});
	it('should validate user credentials', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(Promise.resolve(createdUser));
		const isValid = await usersService.validateUser({
			email: 'a@test.com',
			password: 'password123',
		});
		expect(isValid).toBeTruthy();
	});
	it('should invalidate wrong user credentials', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(Promise.resolve(createdUser));
		const isValid = await usersService.validateUser({
			email: 'a@test.com',
			password: 'wrongpassword',
		});
		expect(isValid).toBeFalsy();
	});
	it('should return null for non-existing user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(Promise.resolve(null));
		const isValid = await usersService.validateUser({
			email: 'nonexistent@test.com',
			password: 'password123',
		});
		expect(isValid).toBeFalsy();
	});
});
