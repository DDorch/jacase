import {Component} from '@angular/core';
import {Formulaire} from '../common/formulaire';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';
import {PipeNumberValidator} from '../common/pipe_number_validator';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers,PipeNumberValidator],
    templateUrl: 'app/common/formulaire.html',
    styleUrls:['app/main.css'],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES],
})

export class FormCondDistri extends Formulaire {
    
    constructor(public http: Http){
        super(http,'cond_distri');
        this.param_composite=false;
    }
    
    initJsonVar(data){
        super.initJsonVar(data);
        for(var i=0; i<this.saisies.length; i++){
            if(this.saisies[i].id=='options'){
                this.idCal_inter=this.saisies[i].idCal;
            }
            if(this.saisies[i].fields){
                if(this.saisies[i].id=='fs_hydraulique'){
                    this.fields=this.saisies[i].fields;
                }
                if(this.saisies[i].id=='fs_param_calc'){
                    this.precision=this.saisies[i].fields[0].value;
                }
            }
        }
        this.initGlob();
        this.initV();
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



