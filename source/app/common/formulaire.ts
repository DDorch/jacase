import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {PipeNumbers} from './pipe_numbers';
import {RadioControlValueAccessor} from './radio_value_accessor';

@Component({
    selector: "formu",
    template: ``
    /*pipes: [PipeNumbers],
    templateUrl: 'app/common/formulaire.html',
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor,],*/
})

export abstract class Formulaire {
    
    public saisies;
    public fields;
    public options = new Object();
    public v = new Object();
    public v_mat = new Object(); // v materiaux (L,M,N)
    public paramVar;
    public tabResults = new Array();
    public idCal;//l'id l'élement selectionné à calculer
    public idCal_inter;
    public nomCal;//le nom l'élement selectionné à calculer
    public unitCal;
    public lineChartLabels = new Array(); // ligne des abscisses pour les graph
    public lineChartData = new Array(); // ligne des ordonnées pour les graph
    public chartData = new Array();
    public lineChartOptions:any;
    /** Specifies the number of decimals */
    public precision;  
    /** The result when there is no varVar */
    public result;
    /** State of radio buttons managing fix, var and cal parameters */
    public glob = new Object(); 
    /** boolean managing the r="champs_cd"esult display */
    public showResult=false;
    /** @obsolete */
    public showVar;
    public var_table=false;
    /** ID of varying parameter */
    public varVar; 
    public varVar_inter;
    /** Parameter's name to vary */ 
    public nomVar;
    public unitVar;
    /** Form name */ 
    public nomForm;
    /** Handling other components than inputs */
    public param_composite;
    /** fs_param_calc */
    public param_calc;

    constructor(public http: Http, formName:string){
        this.nomForm=formName;
        this.paramVar = {
            "min": "",
            "max": "",
            "pas": ""
        };
        this.options=[
            {
                "id": "min",
                "name": "De la valeur minimum: ",
                "value":""
            },
            {
                "id": "max",
                "name": "A la valeur maximum: ",
                "value":""
            },
            {
                "id":"pas",
                "name": "Avec un pas de variation de : ",
                "value":""
            }
        ];

    }
      
    /** 
     * Lecture du fichier json de configuration du formulaire 
     */
    getFields() {
        this.http.get("app/"+this.nomForm+".json")
          .subscribe((res: Response) => {
            this.initJsonVar(res.json());
        });
    }

    /**
     * Initialisation des variables après lecture du json
     */
    initJsonVar(data) {
        this.saisies=data.saisies;
        this.param_calc=this.saisies.fs_param_calc;
        this.fields = this.saisies.fs_hydraulique;
        this.idCal_inter = this.saisies.idCal;
        this.initGlob();
        this.initV();
        this.precision=this.param_calc.value;
    }

    /**
     * Load and data initialisation called by Angular2
     */
    ngOnInit() {
        this.getFields();
    }

    /**
     * Get the name associated to an Id
     */
    getName(id) {
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

     getValue(id) {
        var length=this.fields.length;
        var index;
        for(var i=0;i<length;i++){
            if(this.fields[i].id==id){
                index=i;
            }
        }
        return this.fields[index].value;
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
        var i=Number(this.paramVar['min']);
        while(i<Number(this.paramVar.max)+(Number(this.paramVar.pas)/2)){
            this.lineChartLabels.push(i);
            i=i+Number(this.paramVar.pas);
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
                  text: this.varVar+':'+this.nomVar+'('+this.unitVar+')'
              },
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              },
              maxPadding: 0.02,
              showLastLabel: true
            },
            yAxis: {
                title: {
                    text: this.idCal+':'+this.nomCal+'('+this.unitCal+')'
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
            if(this.fields[i].id==this.idCal_inter){
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
        console.log(this.precision);
        var globBefore=Object.freeze(Object.assign({}, this.glob));
       //recuperer lelement à calculer
        if(value=="cal"){
            this.idCal_inter=id;
        }
        //recuperer l'élement à varier
        if(value=='var'){

            this.initRadVarTable(id);
            this.varVar_inter=id;
            this.showVar=true;
        }
        else{
            this.varVar_inter="";
        }
        for (var cle in this.glob){
            if(globBefore[cle]=='cal' && value!='cal'){
                if(id==cle){
                    if(id=='J'){
                        this.idCal_inter='Q';
                        (<HTMLInputElement>document.getElementById('cal_Q')).checked=true;
                    }
                    else{
                        this.idCal_inter='J';
                        (<HTMLInputElement>document.getElementById('cal_J')).checked=true;
                    }
                }
            }
            
            if(value=='cal'&& globBefore[cle]=='var'){
                if(cle==id){
                    this.varVar_inter="";
                    this.showVar=false;
                }
                else{
                    this.varVar_inter=cle;
                    this.showVar=true;        
                }
            }
            this.glob[cle]='fix';
            this.glob[this.idCal_inter]='cal';
            if(this.varVar_inter!=""){this.glob[this.varVar_inter]='var';}
       }
  }

  getResult(){
      this.idCal=this.idCal_inter;
      this.nomCal=this.getName(this.idCal);
      this.unitCal=this.getUnit(this.idCal);
      this.showResult=true;
      this.RemplirTabResults();
      this.lineChartData.splice(0,this.lineChartData.length);
      this.lineChartLabels.splice(0,this.lineChartLabels.length);
      this.chartData.splice(0,this.chartData.length);

      if(this.showVar){
        this.var_table=true;
        this.varVar=this.varVar_inter;
        this.showVar=true;
        this.nomVar=this.getName(this.varVar);
        this.unitVar=this.getUnit(this.varVar);
        this.getLineChartLabels();
        var n=this.lineChartLabels.length;

        for(var i=0;i<n;i++){
            this.v[this.varVar]=this.lineChartLabels[i];
            this.lineChartData.push(this.calculate());
        }
        this.v[this.varVar]=this.getValue(this.varVar);
        this.getChartData();
        this.getOptions();
        }
                    
      else{
          
          this.result=this.calculate();
      }
  }
  
  calculate() {
    return null;
  }
  


}