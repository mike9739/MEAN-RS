import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
//import {HttpModule} from '@angular/http';
import {routing,appRoutingProviders} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
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
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule

  ],
  providers: [
  appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
