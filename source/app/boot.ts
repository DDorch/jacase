import {bootstrap}    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {enableProdMode} from '@angular/core';
import {MainApp} from './main'
import {appRouterProviders} from './app.routes';
import {MdIconRegistry} from '@angular2-material/icon';


enableProdMode();
bootstrap(MainApp,[HTTP_PROVIDERS,appRouterProviders,MdIconRegistry])
.catch(err => console.error(err));
