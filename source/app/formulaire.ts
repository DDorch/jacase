import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {FORM_DIRECTIVES} from "@angular/common";

@Component({
    selector: 'formu',
    //templateUrl: 
    //directives : 
})

export abstract class Formulaire {
    
    public fields;
    public options = new Object();
    public v = new Object();
    public paramVar;
    public tabResults;
    public idCal;//l'id l'élement selectionné à calculer
    public nomCal;//le nom l'élement selectionné à calculer

    public result;
    public glob; // état des radios
    public showResult=false; //boolean pour afficher le tableau des resultats et le graphique
    public showVar; //A supprimer quand on pourra integrer une ligne dans le ngFor
    public varVar; //l'id du parametre à varier
    //public glob_before={}; //état des radios avant le binding

    constructor(public http: Http){

    }

    setNom(id){
      var nom="";
      var length=this.fields.length;
      var index;
      for(var i=0;i<length;i++){
          if(this.fields[i].id==id){
              index=i;
          }
      }
      return this.fields[index].name;
    }
  
    initRadVarTable(id){

        for(var cle in this.v){

            if(cle==id){
                this.options[0].value=this.v[cle]/2;
                this.options[1].value=this.v[cle]*2;
                this.options[2].value=this.v[cle]/10;
            }
        }
    }

    RemplirTabResults(){

      this.tabResults.ids.splice(0,this.tabResults.ids.length);
      this.tabResults.noms.splice(0,this.tabResults.noms.length);
      this.tabResults.values.splice(0,this.tabResults.values.length);


      var length=this.fields.length;

      for(var i=0;i<length;i++){

          if(this.fields[i].id!=this.idCal){

              this.tabResults.ids.push(this.fields[i].id);
              this.tabResults.noms.push(this.fields[i].name);
              this.tabResults.values.push(this.v[this.fields[i].id]);
          }
          
      }
    }
    

  afficherChamp(id, value){
      //gerer les champs à calculer 
     if(value=='fix') {
         (<HTMLInputElement> document.getElementById(id)).disabled=false;
         }
     else {
         (<HTMLInputElement> document.getElementById(id)).disabled=true;
         }
  }

  gestionRadios(id,value) {

      //recuper l'element à calculer
      if(value=="cal"){
          this.idCal=id;
      }
      //recuperer l'élement à varier
      if(value=='var'){

          this.initRadVarTable(id);
          this.varVar=id;
          this.showVar=true;
      }
      else{
          this.showVar=false;
      }

      console.log(this.varVar);     
      console.log(value+'_'+id);
      console.log(this.glob);
      
      //On gère l'affichage du champ sélectionné
       this.afficherChamp(id,value);
       //console.log(this.showVar);
       // Pour var et cal, on bascule en fix l'ancien champ en var ou cal
       if(value != 'fix') {

           for (var cle in this.glob){
               if(this.glob[cle]==value && cle != id) {
                   (<HTMLInputElement>document.getElementById('fix_'+cle)).checked=true;
                   this.afficherChamp(cle,'fix');
                   (<HTMLInputElement>document.getElementById(value+'_'+cle)).checked=false;
               }
               //pour garder le showVar actif quand on change le param à calculer
               if(value=='cal'&& this.glob[cle]=='var'){
                   this.showVar=true;
               }
              
           }
       }

        // Si l'action est sur un ancien cal, on bascule le champ cal par défaut
        if(this.glob[id]=='cal' && value != 'cal') {
            (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
            this.afficherChamp('J','cal');
            
        }

  }
     
    calculer() {
        this.nomCal=this.setNom(this.idCal);
        this.showResult=true;
        this.RemplirTabResults();

    }
     
  
  

  


}