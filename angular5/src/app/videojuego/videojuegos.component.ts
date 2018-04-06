import { Component} from '@angular/core';

@Component({
	selector: 'videojuegos',
	templateUrl: './videojuegos.component.html'

})
export class videojuegosComponenet{
	public nombre:string;
	public mejor_juego:string ;
	public mejor_juego_retro:string; 
	public mostrar_retro:boolean;
	public year:number; 


	public videojuegos:Array<string> = [
		'Fallout 4',
		'Assassins Creed',
		'Guilty Gear',
		'Overwatch',
		'Bioshock',
		'Blooborne',
		'Battlefield'

	];

	constructor(){
		this.nombre = 'Videojuegos 2018';
		this.mejor_juego= 'GTA 5';
		this.mejor_juego_retro= 'Contra 3';
		this.mostrar_retro= true;
		this.year= 2018;

	}
	

}