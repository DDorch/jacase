import {Component} from '@angular/core';
import {Formulaire} from '../common/formulaire';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';
import {ParamComposite} from '../common/param.composite';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers],
    templateUrl: 'app/common/formulaire.html',
    styles: [`
       .result_fix {
           font-weight: bold;
        }
    `],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, Formulaire, ParamComposite],
})

export class FormLechaptCalmon extends Formulaire {
    

    constructor(public http: Http){
        super(http,'lechapt_calmon/champs_lc');
        this.param_composite=true;
        //Temporaire, il sera initialisé dynamiquement par la suite
        this.v_mat={
            "L": 1.863,
            "M": 2,
            "N": 5.33
        };

    }
    
    calculate(){

        var acalculer=this.v[this.idCal];
        var q=this.v['Q'];
        var d=this.v['D'];
        var j=this.v['J'];
        var lg=this.v['Lg'];
        var nu=this.v['nu'];
        var L=this.v_mat['L'];
        var M=this.v_mat['M'];
        var N=this.v_mat['N'];
        var result:number;

        switch (acalculer){
            case q:
            result = Math.pow((((j*Math.pow(d, N))/L)*(1000/lg)), 1/M);
	        break;
            case d:
            result = Math.pow((((L*Math.pow(q, M))/j)*(lg/1000)), 1/N);
            break;
            case j:
            result = ((L*Math.pow(q, M))/Math.pow(d, N))*(lg/1000);
            break;
            case lg:
            result = ((j*Math.pow(d, N))/(L*Math.pow(q,M)))*1000;
        }

        
    }
}

