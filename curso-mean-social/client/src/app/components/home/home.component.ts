import { Component , OnInit} from '@angular/core';
@Component({
	selector: 'home',
	templateUrl:'./home.component.html'
})
export class HomeComponent implements OnInit 
 {
 	public tittle : string;
	constructor() {
		this.tittle = 'Bienvenido';
	}
	ngOnInit(){
		console.log('home.component cargado!');
	}
}