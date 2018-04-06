import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import  {videojuegosComponenet} from './videojuego/videojuegos.component';


@NgModule({
  declarations: [
    AppComponent,
    videojuegosComponenet
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
