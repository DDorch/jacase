/*import {bootstrap}    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {enableProdMode} from '@angular/core';
import {MainApp} from './main'
import {appRouterProviders} from './app.routes';
import {MdIconRegistry} from '@angular2-material/icon';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

enableProdMode();
bootstrap(MainApp,[HTTP_PROVIDERS,appRouterProviders,MdIconRegistry,disableDeprecatedForms(),provideForms()])
.catch(err => console.error(err));*/
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {enableProdMode} from '@angular/core';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule)
