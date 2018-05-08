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
	public status: string;
	public identity;
	public token;

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
			"",
			"");
	}
	ngOnInit(){
		console.log('componente de login cargado');
	}
	onSubmit(){
		//loguear al usuario yv conseguir sus datos
		this._userService.signup(this.user).subscribe(
			response =>{
				this.identity = response.user;
				console.log(this.identity);
				if (!this.identity || !this.identity._id) {
					this.status = 'error'
				}
				else
				{
					this.status = "sucess"; 
					//persistir datos del usurio
					localStorage.setItem('identity',JSON.stringify(this.identity));

					//conseguir token
					this.gettoken();
				}

				console.log(response.user);
				this.status = 'success'

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if (errorMessage != null) {
					this.status = 'error';
				}
			}
			);
	}
	gettoken()
	{
		this._userService.signup(this.user,'true').subscribe(
			response =>{
				this.token = response.token;
				console.log(this.token);
				if (this.token.lenght <= 0) {
					this.status = 'error'
				}
				else
				{
					this.status = "sucess"; 
					//persistir token
					localStorage.setItem('token',JSON.stringify(this.token));

					//conseguir los contadores de usuario follows . followers

					//redirigir usuario
					this._router.navigate(['/']);

				}

				console.log(response.user);
				this.status = 'success'

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if (errorMessage != null) {
					this.status = 'error';
				}
			}
			);
	}
}
