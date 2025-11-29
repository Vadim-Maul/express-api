import { compare, hash } from 'bcryptjs';

export class User {
	private _password!: string;
	constructor(
		private readonly _email: string,
		private readonly _username: string,
		passwordHash?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}
	public async comparePassword(password: string): Promise<boolean> {
		return compare(password, this._password);
	}
	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	get username(): string {
		return this._username;
	}
}
