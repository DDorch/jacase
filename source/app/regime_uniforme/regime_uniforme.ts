import {Component} from '@angular/core';
import {FormSection} from '../section/form_section';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';
import {PipeNumberValidator} from '../common/pipe_number_validator';
import {cDichotomie} from '../section/dichotomie';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers,PipeNumberValidator],
    templateUrl: 'app/common/formulaire.html',
    styleUrls:['app/main.css'],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, FormSection],
})

export class FormRegimeUniforme extends FormSection {
            
        constructor(public http: Http){
                super(http,'regime_uniforme');
        }

        /**
        * Calcul du débit en régime uniforme.
        * @return Débit en régime uniforme
        */
        Calc_Qn() {
                this.Sn.Reset(true);
                if(this.oP.If <= 0) {
                        var  Qn = 0; // ? false bool
                        //this.oLog.Add('h_normale_pente_neg_nul',true);
                } else {
                        Qn = this.oP.Ks*Math.pow(this.Sn.Calc('R',this.Sn.Y),2/3)*this.Sn.Calc('S',this.Sn.Y)*Math.sqrt(this.oP.If);
                }
                return Qn;
        }

        calculate(rInit) {
                this.init_section_param();
                console.log("in calculate");
                if(this.idCal!='Q' && this.idCal!='Y') {
                        var oDicho = new cDichotomie(this.oLog,this,'Calc_Qn');
                }
                var result:number;
                var flag;
                switch(this.idCal) {
                        case 'Y':
                        result = this.Sn.Calc('Yn');
                        break;
                        case 'Q':
                        result = this.Calc_Qn();
                        break;
                        default :

                        [result,flag] = oDicho.calculer(this.v['Q'],this.precision,rInit);
                }
                
                return result;
        }    

    
}