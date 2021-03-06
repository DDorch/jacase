import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Formulaire} from './common/formulaire';
import {FormCondDistri} from './cond_distri/cond_distri';
import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon'; 
import { MainApp }  from './main';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {Routing} from './app.routes';
import { HttpModule, JsonpModule }     from '@angular/http';
import {MdSidenavModule} from '@angular2-material/sidenav';
import {MdToolbarModule} from '@angular2-material/toolbar';
import {MdIconModule, MdIconRegistry} from '@angular2-material/icon';
import {MdButtonModule} from '@angular2-material/button';
import {MdListModule} from '@angular2-material/list';
import {RadioControlValueAccessor} from './common/radio_value_accessor';
import {PipeNumbers} from './common/pipe_numbers';
import {PipeNumberValidator} from './common/pipe_number_validator';
import {FormSection} from './section/form_section';
import {FormSectionParam} from './section_parametree/section_parametree';
import {FormRemous} from './remous/remous';
import {FormRegimeUniforme} from './regime_uniforme/regime_uniforme';
import {acSection, cParam, cHautConjuguee, cHautCorrespondante, cHautNormale, cHautCritique } from './section/section_type';
import {cDichotomie} from './section/dichotomie';
import {cSnTrapez} from './section/section_trapez';
import {cSnRectang} from './section/section_rectang';
import {cSnCirc} from './section/section_circulaire';
import {cSnPuiss} from './section/section_puissance';
import {acNewton} from './section/newton';

@NgModule({
  imports:[ 
      HttpModule,
      BrowserModule, 
      FormsModule, 
      ReactiveFormsModule,
      Routing,
      MdSidenavModule,
      MdToolbarModule,
      MdIconModule,
      MdListModule,
      MdButtonModule,
      JsonpModule
                 
  ],
  providers:    [ MdIconRegistry],
  declarations: [ FormSectionParam, FormRemous, FormRegimeUniforme, FormSection, FormSectionParam, PipeNumbers, PipeNumberValidator, 
                  MainApp, Formulaire, FormCondDistri, FormLechaptCalmon /*, acSection, cParam , cDichotomie, 
                  cSnTrapez, cSnRectang, cSnCirc, cSnPuiss, acNewton, cHautConjuguee, cHautCorrespondante, cHautNormale, cHautCritique */
                ],
  bootstrap:    [ MainApp ]
})

export class AppModule { }