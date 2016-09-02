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
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, Formulaire],
})

export class FormLechaptCalmon extends Formulaire {
    
    constructor(public http: Http){
        super(http,'lechapt_calmon');
        this.param_composite=true;
        //Temporaire, il sera initialisé dynamiquement par la suite
        this.v_mat={
            "L": 1.863,
            "M": 2,
            "N": 5.33
        };

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
                if(this.saisies[i].id=='fs_materiau'){
                    this.selectedType=this.saisies[i].fields[0].value;
                    this.mat_fields=this.saisies[i].fields[0];
                }
            }
        }
        this.initGlob();
        this.initV();
    }
    calculate(rInit){
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

        return result;
        
    }
    onChange(value){
       this.selectedType=value;
       this.v_mat['L']=6;
       var types=this.saisies[0].fields[0].select;
       var length=types.length;
       for(var type of types){
           if(this.selectedType==type.id){
               this.v_mat['L']=type.parameters[0].value;
               this.v_mat['M']=type.parameters[1].value;
               this.v_mat['N']=type.parameters[2].value;
           }
       }
   }
}

