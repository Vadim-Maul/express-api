import { hash } from 'bcryptjs';

export class User {
	private _password!: string;
	constructor(
		private readonly _email: string,
		private readonly _username: string,
	) {}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
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
