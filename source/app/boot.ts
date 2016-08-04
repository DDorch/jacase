import {bootstrap}    from '@angular/platform-browser-dynamic';
//import {FormCondDistri} from './cond_distri/cond_distri';
//import {Formulaire} from './common/formulaire';
import {HTTP_PROVIDERS} from '@angular/http';
import {enableProdMode} from '@angular/core';
//import {ParamComposite} from './common/param.composite';
//import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon';
import {MainApp} from './main'
import {appRouterProviders} from './app.routes';

enableProdMode();
//bootstrap(FormCondDistri,[Formulaire,ParamComposite,HTTP_PROVIDERS]);
//bootstrap(FormLechaptCalmon,[Formulaire,ParamComposite,HTTP_PROVIDERS]);
bootstrap(MainApp,[HTTP_PROVIDERS,appRouterProviders])
.catch(err => console.error(err));
