import { Routes, RouterModule } from '@angular/router';
import {FormCondDistri} from './cond_distri/cond_distri';
import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon';
import {FormRegimeUniforme} from './regime_uniforme/regime_uniforme';
import {FormRemous} from './remous/remous';

const routes: Routes = [
    {path:'cond_distri', component: FormCondDistri} ,
    {path:'lechapt_calmon', component: FormLechaptCalmon } ,
    {path:'regime_uniforme', component: FormRegimeUniforme },
    {path:'remous', component: FormRemous }
   /* {path:'ouvrages', component: FormOuvrages },
    ,
    {path:'lechapt_calmon', component: FormRegUniforme },*/
];

export const Routing = RouterModule.forRoot(routes);