export class AuthModel {
	userName: string;
	password: string;
	autoLogin: boolean;

	constructor(){
		this.autoLogin = true;
	}
}
