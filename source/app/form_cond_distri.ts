import {Component} from '@angular/core';
import {Formulaire} from './formulaire';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES} from "@angular/common";
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
        this.v={
            "Q": "3",
            "D": "1.2",
            "J": "0.6",
            "Lg": "100",
            "nu": "1E-6",
            "pr":"0.001"
        };
        this.glob={
            "Q": "fix",
            "D": "fix",
            "J": "cal",
            "Lg": "fix",
            "nu": "fix"
        };
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
    getRadioValue(radioName) {

        var radioElmt : any = document.getElementsByTagName(radioName);
        var choix = "";
        for (var i=0; i<radioElmt.length; i++){
            if (radioElmt.checked){
                    choix = radioElmt[i].value;
            }
        }
        return choix;
    }
  setVarGlob(){
      for(var i=0;i<this.fields.length;i++){
          this.glob[this.fields[i].id]=this.getRadioValue("choix_champ_"+this.fields[i].id);
      }
  }
  setVarGlobBefore(){
      this.glob_before=this.glob;
  }

  afficherChamp(id, value){
      //gerer les champs à calculer 
     if(value=='fix') {
         (<HTMLInputElement> document.getElementById(id)).disabled=false;
         }
     else {
         (<HTMLInputElement> document.getElementById(id)).disabled=true;
         }
         // A compléter avec les champs à afficher si on choisi une 'var'
  }
  gestionRadios(id,value) {
     
      
      console.log(this.glob);

       // On gère l'affichage du champ sélectionné
       /*this.afficherChamp(id,value);
       // Pour var et cal, on bascule en fix l'ancien champ en var ou cal
       if(value != 'fix') {
           for (var cle in this.glob){
               if(this.glob[cle]==value && cle != id) {
                   (<HTMLInputElement>document.getElementById('fix_'+cle)).checked=true;
                   this.afficherChamp(cle,'fix');
                }
           }
        }
        // Si l'action est sur un ancien cal, on bascule le champ cal par défaut
        if(this.glob[id]=='cal' && value != 'cal') {
            (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
            this.afficherChamp('J','cal');
        }
        this.setVarGlob();
        */
  }
  

  calculer() {
      //this.v.splice(0,this.v.length);
      var length=this.fields.length;
      console.log(this.v);
      console.log(this.glob);

            
      //Récupérer l'id l'élement selectionné à calculer
 
      var id;

      for(var i=0;i<length;i++){ 
            var e = <HTMLInputElement> document.getElementById("cal_"+ this.fields[i].id);
            if (e.checked) {
                id=this.fields[i].id;
            }
            else{
                id="J";
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

