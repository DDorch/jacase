import {Component} from '@angular/core';
import {Formulaire} from './formulaire';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES,NgClass,CORE_DIRECTIVES} from "@angular/common";
import {RadioControlValueAccessor} from "./radio_value_accessor";
import {Observable} from 'rxjs/Rx';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import 'rxjs/Rx';

@Component({
    selector: 'form_cond',
    templateUrl: 'app/form_cond_distri.html',
     
    directives : [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor] 
})

export class FormCondDistri extends Formulaire {
    

    constructor(http: Http){
        super(http);
   
     }

    ngOnInit() {

        this.getFieldsAndOptions();
    }

    getFieldsAndOptions() {

      Observable.forkJoin(

        this.http.get('/app/champs_cd.json').map((res:Response) => res.json().fields),
        this.http.get('/app/champs_cd.json').map((res:Response) => res.json().idCal),
        this.http.get('/app/choix_var.json').map((res:Response) => res.json().options)

      ).subscribe(
          
          data => { this.fields = data[0]
                    this.idCal=data[1]
                    this.options=data[2]
                },
          err => console.error(err)
      );

    }

    calculer(){

        this.initialiserV();
        this.v[this.varVar]="";
        this.nomVar="";
        super.calculer();
        this.lineChartData.splice(0,this.lineChartData.length);

        if(this.showVar){

            this.nomVar=this.setNom(this.varVar);
            this.getLineChartLabels();
            var n=this.lineChartLabels.length;
            
            for(var i=0;i<n;i++){
                this.v[this.varVar]=this.lineChartLabels[i];
                this.lineChartData.push(this.calCondDistri());
            }
        }
                      
        else{
            this.result=this.calCondDistri();
        }
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



