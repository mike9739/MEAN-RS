import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//cargar componentes
import { AppComponent } from './app.component';
import {LoginComponent} from  './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
