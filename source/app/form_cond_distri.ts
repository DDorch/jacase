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
      //this.v.splice(0,this.v.length);
      var length=this.fields.length;

      for(var i=0;i<length;i++){
          this.v[this.fields[i].id] = (<HTMLInputElement> document.getElementById(this.fields[i].id)).value;
          this.v[this.fields[i].id] = Number(this.v[this.fields[i].id]);
      }
      console.log(this.v);

      //Récupérer l'id l'élement selectionné à calculer
 
      var id;

      for(var i=0;i<length;i++){ 
            var e = <HTMLInputElement> document.getElementById("cal_"+ this.fields[i].id);
            if (e.checked) {
                id=this.fields[i].id;
            }
        
        }

      this.result=this.cond_distri(id);
      console.log(this.result);      
  }
  
  cond_distri(id){

    var acalculer=this.v[id];
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

  afficherResultat(){
           document.getElementById('result_table').style.display="block";
  }


}

