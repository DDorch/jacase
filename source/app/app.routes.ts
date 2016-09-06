import { Routes, RouterModule } from '@angular/router';
import {FormCondDistri} from './cond_distri/cond_distri';
import {FormLechaptCalmon} from './lechapt_calmon/lechapt_calmon';
import {FormRegimeUniforme} from './regime_uniforme/regime_uniforme';
import {FormRemous} from './remous/remous';
import {FormSectionParam} from './section_parametree/section_parametree';

const routes: Routes = [
    {path:'cond_distri', component: FormCondDistri} ,
    {path:'lechapt_calmon', component: FormLechaptCalmon } ,
    {path:'regime_uniforme', component: FormRegimeUniforme },
    {path:'remous', component: FormRemous },
    {path:'section_parametree', component: FormSectionParam }
];

export const Routing = RouterModule.forRoot(routes);