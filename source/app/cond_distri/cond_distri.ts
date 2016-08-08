import {Component} from '@angular/core';
import {Formulaire} from '../common/formulaire';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers],
    templateUrl: 'app/common/formulaire.html',
    styleUrls:['app/main.css'],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, Formulaire],
})

export class FormCondDistri extends Formulaire {
    
    constructor(public http: Http){
        super(http,'cond_distri');
        this.param_composite=false;
    }
    
    calculate(){
        var acalculer=this.v[this.idCal];
        var q=this.v['Q'];
        var d=this.v['D'];
        var j=this.v['J'];
        var lg=this.v['Lg'];
        var nu=this.v['nu'];
        var K = 0.3164 * Math.pow(4,1.75)/(5.5*9.81*Math.pow(3.1415,1.75)); // Constante de la formule
        var result:number;

        switch (acalculer){

            case j:
            result = K*Math.pow(nu,0.25)*Math.pow(q,1.75)*lg/Math.pow(d,4.75);
            break;
            case d:
            result=Math.pow(j/(K*Math.pow(nu,0.25)*Math.pow(q,1.75)*lg),1/4.75);
            break;
            case q:
            result=Math.pow(j/(K*Math.pow(nu,0.25)*lg/Math.pow(d,4.75)),1/1.75)
            break;
            case lg:
            result=j/(K*Math.pow(nu,0.25)*Math.pow(q,1.75)/Math.pow(d,4.75));
            break;
            case nu:
            result=Math.pow(j/(K*Math.pow(q,1.75)*lg/Math.pow(d,4.75)),1/0.25);
            break;
        }        
        
        return result;
    }
}



