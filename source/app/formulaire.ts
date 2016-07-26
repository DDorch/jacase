import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES} from "@angular/common";
import {CORE_DIRECTIVES} from "@angular/common";

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
    public tabResults = new Array();
    public idCal;//l'id l'élement selectionné à calculer
    public nomCal;//le nom l'élement selectionné à calculer
    public unitCal;
    public lineChartLabels = new Array(); // ligne des abscisses pour les graph
    public lineChartData = new Array(); // ligne des ordonnées pour les graph
    public chartData = new Array();
    public lineChartOptions:any;
      
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
    public unitVar;
    /** Form name */ 
    public nomForm;


    constructor(public http: Http, formName: string){
        this.nomForm = formName;
        this.paramVar = {
            "min": "",
            "max": "",
            "pas": ""
        };
        /*this.tabResults = {
            };*/
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
     * Get the unit associated to an Id
     */
    getUnit(id) {
        var length=this.fields.length;
        var index;
        for(var i=0;i<length;i++){
            if(this.fields[i].id==id){
                index=i;
            }
        }
        return this.fields[index].unit;
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
    getChartData(){
        for(var i=0; i<this.lineChartData.length; i++){
            this.chartData.push([this.lineChartLabels[i],this.lineChartData[i]]);
        }
      
    }
    getOptions(){
        this.lineChartOptions={
            title: {text:""},
            chart: { zoomType: 'x'},
            xAxis: {
              reversed: false,
              title: {
                  enabled: true,
                  text: this.varVar+':'+this.getNom(this.varVar)
              },
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              },
              //maxPadding: 0.05,
              showLastLabel: true
            },
            yAxis: {
                title: {
                    text: this.idCal+':'+this.nomCal
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                lineWidth: 2
            },
             legend: {
                  enabled: false
            },
            tooltip: {
                  //headerFormat: '<b>{series.name}</b><br/>',
                  pointFormat: '{point.x} : {point.y}'
            },
            plotOptions: {
                  spline: {
                      marker: {
                          enable: false
                      }
                  }
            },
            series:[{
                data: this.chartData
             }]
              
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
      
      this.tabResults.splice(0,this.tabResults.length);
      var length=this.fields.length;

      for(var i=0;i<length;i++){

          if(this.fields[i].id!=this.idCal){

              var j = this.tabResults.push(this.fields[i]);
              this.tabResults[j-1].value = this.v[this.fields[i].id];
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
       }

       console.log(this.glob);           
       console.log(globBefore);  

  }
            
    calculer() {
        this.nomCal=this.getNom(this.idCal);
        this.unitCal=this.getUnit(this.idCal);
        this.showResult=true;
        this.RemplirTabResults();
    }

  
}