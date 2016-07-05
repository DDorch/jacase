import {Component} from '@angular/core';
import {Formulaire} from './formulaire';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

@Component({
    selector: 'form_cond',
    templateUrl: 'app/form_cond_distri.html'
  
    //directives : 
})

export class FormCondDistri extends Formulaire {
    
    constructor(http: Http){
        super(http);
    }

    ngOnInit() {

        this.getFields();
    }

    getFields() {

        this.http.get('/app/champs_cd.json')
        .map((res:Response) => res.json().fields)
        .subscribe(
            data => { this.fields = data},
            err => console.error(err),
            () => console.log('done')
        );
  }

  activeDesactive(id) {
 
        console.log(id);

        var v1 = <HTMLInputElement> document.getElementById("fix_"+id);
        var v2 = <HTMLInputElement> document.getElementById("var_"+id);
        var v3 = <HTMLInputElement> document.getElementById("cal_"+id);

        var ids=['Q','D','J','Lg','nu'];
        var n=ids.length;

        var e1=new Array();
        var e2=new Array();
        var e3=new Array();

        for(var i=0;i<n;i++){ 
            var v = <HTMLInputElement> document.getElementById("fix_"+ ids[i]);
            e1.push(v);
        }

        for(var i=0;i<n;i++){ 
            var v = <HTMLInputElement> document.getElementById("var_"+ ids[i]);
            e2.push(v);
        }

        for(var i=0;i<n;i++){ 
            var v = <HTMLInputElement> document.getElementById("cal_"+ ids[i]);
            e3.push(v);
        }

        if(v2.checked){
            for(var i=0;i<n;i++){
                for(var j=0;j<n;j++){
                    if(e2[i]==v2 && j!=i){
                        e2[j].checked=false;
                        for(var k=0;k<n;k++){
                            if(e3[k].checked && k!=j){
                                e1[j].checked=true;
                                e1[k].checked=false;
                            } 
                            else if(e2[k].checked && k!=i){
                                e1[k].checked=true;
                                e1[j].checked=true;
                            }
                        }  
                    }
                }
            }  
        }  

        if(v3.checked){
            for(var i=0;i<n;i++){
                for(var j=0;j<n;j++){
                    if(e3[i]==v3 && j!=i){
                        e3[j].checked=false;
                        for(var k=0;k<n;k++){
                            if(e2[k].checked && k!=j){
                                e1[j].checked=true;
                                e1[k].checked=false;
                            } 
                            else if(e3[k].checked && k!=i){
                                e1[k].checked=true;
                                e1[j].checked=true;
                            }
                        }
                    }   
                }  
            } 
        }
                
       
  }

  calculer() {

      this.inputs.splice(0,numbers.length);

      for(var i=0;i<5;i++){
          var v=<HTMLInputElement> document.getElementById(i.toString());
          this.inputs.push(v.value);
        }
      
      var v=<HTMLInputElement> document.getElementById("pr");
      this.inputs.push(v.value);

      var numbers=new Array<number>();
      var n=this.inputs.length;
      console.log(n);

      for(var i=0;i<n;i++){          
          numbers.push(Number(this.inputs[i]));
      }
            //Récupérer l'élement selectionné à calculer

      var m=0;
      var ids=['Q','D','J','Lg','nu'];
      n=ids.length;
      for(var i=0;i<n;i++){ 
            var v = <HTMLInputElement> document.getElementById("cal_"+ ids[i]);
            //variables.push(v);
            if (v.checked) {
                m=i;
            }
        
        }

       

      console.log(numbers);
      this.result=this.cond_distri(numbers,m);
      console.log(this.result);
           
  }
  
  cond_distri(numbers: Array<number>,index:number){

    var acalculer=numbers[index];
    var q=numbers[0];
    var d=numbers[1];
    var j=numbers[2];
    var lg=numbers[3];
    var nu=numbers[4];
    //var p=numbers[5];

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

  afficherResultat(){
           document.getElementById('result_table').style.display="block";
  }


}

