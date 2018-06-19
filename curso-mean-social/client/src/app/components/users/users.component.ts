import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';

@Component({
	selector:'users',
	templateUrl:'./users.component.html',
	providers: [UserService]
}) 

export class UsersComponent implements OnInit {
	
	public tittle:string;
	public identity;
	public token;
	public page;
	public next_page;
	public prev_page;
	public status: string;
	public total;
	public pages;
	public users : User[];
	public url;
	public follows;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
		) {
		this.tittle = 'Gente';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}
	ngOnInit(){
		console.log("user.component ha sido cargado");
		this.actualPage();

	}
	actualPage()
	{
		this._route.params.subscribe(params => {
			let page = +params['page'];
			this.page = page;
	
			if (!params['page']) {
				page=1;
			}
			
			if (!page) {
				page =1;
			}
			else
			{
				this.next_page = page +1;
				this.prev_page = page-1;

				if (this.prev_page <=0) {
					this.prev_page =1;
				}
			}

			//devolver listado de usuarios
			this.getUSers(page);

		});
	}
	getUSers(page){
		this._userService.getUsers(page).subscribe(response=>{
			if (!response.users) {
				this.status="error";

			}
			else
			{
			this.total = response.total;
			this.users = response.users;
			this.pages = response.pages;
			this.follows = response.users_following;
			console.log(this.follows);

			if (page>this.pages) {
				this._router.navigate(['/gente',1]);
			}

			}

		},
		error=>{
			var errorMesage = <any>error;
			console.log(errorMesage);
			if (errorMesage != null) {
				this.status = 'error'
			}
		});
	}
	public followUserOver;
	mouseEnter(user_id){
		this.followUserOver=user_id;	
	}
	mouseLeave(user_id)
	{
		this.followUserOver=0;
	}	

}




