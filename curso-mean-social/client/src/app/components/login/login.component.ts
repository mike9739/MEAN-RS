import {Component,OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from  '../../models/user'
import {UserService} from '../../services/user.service';


@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})
export class LoginComponent implements OnInit{
	public title:string;
	public user:User;

	constructor(
		private _route:ActivatedRoute,
		private _router: Router,
		private _userService: UserService
		){
		this.title = 'Bienvenido, por favor inicia sesión';
		this.user = new User(
			"",
			"",
			"",
			"",
			"",
			"",
			"");
	}
	ngOnInit(){
		console.log('componente de login cargado');
	}
	onSubmit(){
		console.log(this.user)
	}
}
