import {bootstrap}    from '@angular/platform-browser-dynamic';
import {FormCondDistri} from './form_cond_distri';
import {Formulaire} from './formulaire';
import {HTTP_PROVIDERS} from '@angular/http';
import {enableProdMode} from '@angular/core';

enableProdMode();
bootstrap(FormCondDistri,[Formulaire,HTTP_PROVIDERS]);
//bootstrap(Formulaire,[FormCondDistri,HTTP_PROVIDERS]);