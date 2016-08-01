import {bootstrap}    from '@angular/platform-browser-dynamic';
import {FormCondDistri} from './conduite_distri/form_cond_distri';
import {Formulaire} from './common/formulaire';
import {HTTP_PROVIDERS} from '@angular/http';
import {enableProdMode} from '@angular/core';

enableProdMode();
bootstrap(FormCondDistri,[Formulaire,HTTP_PROVIDERS]);
