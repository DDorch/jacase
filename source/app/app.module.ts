import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Formulaire} from './common/formulaire';
import {FormCondDistri} from './cond_distri/cond_distri';
import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon'; 
import { MainApp }  from './main';
import { FormsModule }   from '@angular/forms';
import {Routing} from './app.routes';
import { HttpModule }     from '@angular/http';
import {MdIconRegistry} from '@angular2-material/icon';


@NgModule({
  imports:      [ HttpModule, BrowserModule, FormsModule, Routing ],
  providers:    [ MdIconRegistry ],
  declarations: [ MainApp, Formulaire, FormCondDistri, FormLechaptCalmon ],
  bootstrap:    [ MainApp ]
})

export class AppModule { }