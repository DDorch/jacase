import {Component} from '@angular/core';
import {Formulaire} from './formulaire';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from "@angular/common";
import {RadioControlValueAccessor} from "./radio_value_accessor";
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';

@Component({
    selector: 'form_cond',
    templateUrl: 'app/formulaire.html',
     
    directives : [ CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor] 
})

export class FormCondDistri extends Formulaire {
    

    constructor(public http: Http){
        super(http,"champs_cd");
     }


    calculer(){

        this.initV();
        //this.v[this.varVar]=this.getValue(this.varVar);
        this.nomVar="";
        this.unitVar="";
        super.calculer();
        this.lineChartData.splice(0,this.lineChartData.length);
        this.lineChartLabels.splice(0,this.lineChartLabels.length);
        this.chartData.splice(0,this.chartData.length);

        if(this.showVar){

            this.nomVar=this.getNom(this.varVar);
            this.unitVar=this.getUnit(this.varVar);
            this.getLineChartLabels();
            var n=this.lineChartLabels.length;
            
            for(var i=0;i<n;i++){
                this.v[this.varVar]=this.lineChartLabels[i];
                this.lineChartData.push(this.calCondDistri());
            }
            this.getChartData();
            this.getOptions();
        }
                      
        else{
            this.result=this.calCondDistri();
        }
        console.log(this.chartData);
    }

    calCondDistri(){
                
        var acalculer=this.v[this.idCal];
        var q=this.v['Q'];
        var d=this.v['D'];
        var j=this.v['J'];
        var lg=this.v['Lg'];
        var nu=this.v['nu'];
        //var p=numbers[5];*/

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



