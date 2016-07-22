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
    
    public fields;
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
     * Get the name associated to an Id
     */
    getNom(id) {
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

    /**
     * Initialisation of V: the variable containing the input values
     */
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
        //return this.glob;
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
    
  gestionRadios(id,value) {

       var globBefore=Object.freeze(Object.assign({}, this.glob));
       //recuper lelement à calculer
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
        for (var cle in this.glob){
            if(globBefore[cle]=='cal' && value!='cal'){
                if(id==cle){
                    if(id=='J'){
                        this.idCal='Q';
                        (<HTMLInputElement>document.getElementById('cal_Q')).checked=true;
                    }
                    else{
                        this.idCal='J';
                        (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
                    }
                }
            }
            
            if(value=='cal'&& globBefore[cle]=='var'){
                if(cle==id){
                    this.varVar="";
                    this.showVar=false;
                }
                else{
                    this.varVar=cle;
                    this.showVar=true;        
                }
            }
            this.glob[cle]='fix';
            this.glob[this.idCal]='cal';
            if(this.varVar!=""){this.glob[this.varVar]='var';}
            if(this.glob[cle]=='fix'){
                (<HTMLInputElement> document.getElementById(cle)).disabled=false;
            }
            else{
                (<HTMLInputElement> document.getElementById(cle)).disabled=true;
            }

        }

       console.log(this.glob);           
       console.log(globBefore);  

  }
            
    calculer() {
        this.nomCal=this.getNom(this.idCal);
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