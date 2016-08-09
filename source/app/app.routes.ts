import { provideRouter, RouterConfig } from '@angular/router';
import {FormCondDistri} from './cond_distri/cond_distri';
import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon';

const routes: RouterConfig = [
    {path:'cond_distri', component: FormCondDistri} ,
    {path:'lechapt_calmon', component: FormLechaptCalmon } ,
   /* {path:'ouvrages', component: FormOuvrages },
    {path:'lechapt_calmon', component: FormRemous },
    {path:'lechapt_calmon', component: FormRegUniforme },
    {path:'lechapt_calmon', component: FormSectionParam }*/
];

export const appRouterProviders = [ provideRouter(routes) ];