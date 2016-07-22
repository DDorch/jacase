import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES} from "@angular/common";
import {CORE_DIRECTIVES} from "@angular/common";
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';


@Component({
    selector: 'formu',
    //templateUrl: 
    //directives : 
})


export abstract class Formulaire {
    
    public champs;
    public fields;
    public f;
    public options = new Object();
    public v = new Object();
    public paramVar;
    public tabResults;
    public idCal;//l'id l'élement selectionné à calculer
    public nomCal;//le nom l'élement selectionné à calculer
    public lineChartLabels = new Array(); // ligne des abscisses pour les graph
    public lineChartData = new Array(); // ligne des ordonnées pour les graph
    public lineChartOptions:any = {
        animation: false,
        responsive: true
    };
    public lineChartColours:any = { // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    };    
    
    //public lineChartLegend:boolean = true;
    /** Type of line for the chart displayed in the results */
    public lineChartType:string = 'line'; 
    /** ???? */
    public result;
    /** State of radio buttons managing fix, var and cal parameters */
    public glob = new Object(); 
    /** boolean managing the result display */
    public showResult=false;
    /** @obsolete */
    public showVar;
    /** ID of varying parameter */
    public varVar; 
    /** Parameter's name to vary */ 
    public nomVar;
    /** Form name */ 
    public nomForm;


    constructor(public http: Http, formName: string){
        this.nomForm = formName;
        this.paramVar = {
            "min": "",
            "max": "",
            "pas": ""
        };
        this.tabResults = {
            "ids":[],
            "noms":[],
            "values":[]
        };
    }
    
    
    /** 
     * Lecture du fichier json de configuration du formulaire 
     */
    getFieldsAndOptions() {
        this.http.get("/app/"+this.nomForm+".json")
          .subscribe((res: Response) => {
            this.initJsonVar(res.json());
        });
    }


    /**
     * Initialisation des variables après lecture du json
     */
    initJsonVar(data) {
        this.fields = data.fields;
        this.idCal = data.idCal;
        this.options = data.options;
        this.initGlob();
        this.initV();
    }


    /**
     * Load and data initialisation called by Angular2
     */
    ngOnInit() {
        this.getFieldsAndOptions();
    }


    /**
     * ?????
     */
    setNom(id) {
        var length=this.fields.length;
        var index;
        for(var i=0;i<length;i++){
            if(this.fields[i].id==id){
                index=i;
            }
        }
        return this.fields[index].name;
    }
  
  
    /**
     * Initialisation of min/max/step fields for field variation
     */
    initRadVarTable(id) {
        var length=this.fields.length;
        for(var i=0;i<length;i++){

            if(this.fields[i].id==id){
                this.paramVar.min=this.fields[i].value/2;
                this.paramVar.max=this.fields[i].value*2;
                this.paramVar.pas=this.fields[i].value/10;
            }
        }
    }

    getLineChartLabels() {

        this.lineChartLabels.splice(0,this.lineChartLabels.length);
        var i=this.paramVar.min;
        while(i<=(this.paramVar.max+(this.paramVar.pas/2))){
            this.lineChartLabels.push(i);
            i=i+this.paramVar.pas;
        }
    }

    initV(){


        var length=this.fields.length;

        for(var i=0;i<length;i++){
            this.v[this.fields[i].id]=this.fields[i].value;
        }
        return this.v;
    }
    
    
    /**
     * Initialisation of glob : the variable managing radio buttons
     */
    initGlob(){

        var length=this.fields.length;

        for(var i=0;i<length;i++){
            if(this.fields[i].id==this.idCal){
                this.glob[this.fields[i].id]='cal';
            }
            else{
                this.glob[this.fields[i].id]='fix';
            }
        }
        return this.glob;
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
      console.log(this.idCal);
      //this.v=this.initialiserV();
      //this.glob=this.initialiserGlob();
      (<HTMLInputElement>document.getElementById('cal_Q')).checked=false;
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
          this.varVar="";
      }
      
      //On gère l'affichage du champ sélectionné
       this.afficherChamp(id,value);
       //console.log(this.showVar);
       // Pour var et cal, on bascule en fix l'ancien champ en var ou cal
       if(value != 'fix') {

           for (var cle in this.glob){
               if(this.glob[cle]==value && cle != id) {
                   this.glob[cle]=='fix';
                   (<HTMLInputElement>document.getElementById('fix_'+cle)).checked=true;
                   this.afficherChamp(cle,'fix');
                   (<HTMLInputElement>document.getElementById(value+'_'+cle)).checked=false;
               }
               //pour garder le showVar actif quand on change le param à calculer
               if(value=='cal'&& this.glob[cle]=='var'){
                   if(cle==id){
                       this.varVar="";
                       this.showVar=false;
                   }
                   else{
                       this.varVar=cle;
                       this.showVar=true;        
                   }
               }
               if(this.glob[cle]=='cal'&& value!='cal'){
                   if(cle==id){
                       if(id=='J'){
                            (<HTMLInputElement>document.getElementById('cal_Q')).checked=true;
                            this.afficherChamp('Q','cal');

                            //this.glob['Q']='cal';
                            
                       }
                       else if(id=='Q'){
                            (<HTMLInputElement>document.getElementById('cal_Q')).checked=false;
                            (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
                            this.afficherChamp('J','cal');
                            //this.glob[cle]=value;

                       }
                       else{
                           (<HTMLInputElement>document.getElementById('cal_Q')).checked=false;
                           (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
                           //(<HTMLInputElement>document.getElementById('cal_Q')).disabled=true;

                           this.afficherChamp('J','cal');
                          
                       }
                   }
                   else{
                       //this.glob[id]=value;

                   }

               }
                           
           }
       }
       //Ne pas pouvoir cocher les radio fix_
        /*else{
    
                (<HTMLInputElement>document.getElementById('fix_'+id)).disabled=false; 

            

       }*/

        console.log(this.glob);               
    }
     
    calculer() {
        this.nomCal=this.setNom(this.idCal);
        this.showResult=true;
        this.RemplirTabResults();
    }

    //chart events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }
  

  


}