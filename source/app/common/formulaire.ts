import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {PipeNumbers} from './pipe_numbers';
import {RadioControlValueAccessor} from './radio_value_accessor';
import {PipeNumberValidator} from './pipe_number_validator';

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
    public sectionFields;
    public biefFields
    public options = new Object();
    public v = new Object();
    public v_mat = new Object(); // v materiaux
    public paramVar;
    public tabResults = new Array();
    public idCal:string;//l'id l'élement selectionné à calculer
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
    public varVar_inter='';
    /** Parameter's name to vary */ 
    public nomVar;
    public unitVar;
    /** Form name */ 
    public nomForm;
    /** Handling other components than inputs */
    public param_composite;
    /** fs_param_calc */
    public param_calc;
    public selectedType;
    public mat_fields;
    public option='';


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
                "name": "Minimum: ",
                "value":""
            },
            {
                "id": "max",
                "name": "Maximum: ",
                "value":""
            },
            {
                "id":"pas",
                "name": "Pas de variation: ",
                "value":""
            }
        ];
    }
      
    /** 
     * Lecture du fichier json de configuration du formulaire 
     */
    getFields() {
        this.http.get("app/"+this.nomForm+"/"+this.nomForm+".config.json")
          .subscribe((res: Response) => {
            this.initJsonVar(res.json());
        });
    }

    /**
     * Initialisation des variables après lecture du json
     */
    initJsonVar(data) {
        this.saisies=data.saisies;
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
        console.log("index "+index);
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
     * Get the value assocated to an Id
     */
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
        this.glob={};
        var length=this.fields.length;
        if(this.option!='fix'){
            for(var i=0;i<length;i++){
                if(this.fields[i].id==this.idCal_inter){
                    this.glob[this.fields[i].id]='cal';
                }
                else{
                    this.glob[this.fields[i].id]='fix';
                }
        }
        }
        else{
            for(var i=0;i<length;i++){
                this.glob[this.fields[i].id]='fix';
            }
        }
        console.log(this.glob);
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
    
    /**
     * Get the position of a field from its Id
     */
    getPosition(id){
        var length=this.fields.length;
        var p = 0;
        for(var i=0; i<length; i++){
            if(this.fields[i].id==id){
                p=i;
            }
        }
        return p;
    }

    /**
     * Manage the radio buttons
     */
    gestionRadios(id,value) {
        console.log(this.fields);
        var length=this.fields.length;
        var globBefore=Object.freeze(Object.assign({}, this.glob));
       //recuperer lelement à calculer
        if(value=="cal"){
            this.idCal_inter=id;
        }
        console.log(this.idCal_inter);
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
                    if(this.getPosition(this.idCal_inter)!=length-1){
                        var newCal=this.fields[this.getPosition(this.idCal_inter)+1].id;
                        this.idCal_inter=newCal;
                        (<HTMLInputElement>document.getElementById('cal_'+this.idCal_inter)).checked=true;
                    }
                    else{
                        this.idCal_inter=this.fields[0].id;
                        (<HTMLInputElement>document.getElementById('cal_'+this.idCal_inter)).checked=true;
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
       console.log(this.glob);
  }

  /**
   * Method called from the template that shows the results
   */
  getResult(){
      console.log(this.varVar_inter);  
      this.idCal=this.idCal_inter;
      console.log(this.idCal);
      this.nomCal=this.getName(this.idCal);
      this.unitCal=this.getUnit(this.idCal);
      this.showResult=true;
      this.RemplirTabResults();
      this.lineChartData.splice(0,this.lineChartData.length);
      this.lineChartLabels.splice(0,this.lineChartLabels.length);
      this.chartData.splice(0,this.chartData.length);

      if(this.varVar_inter!=''){
          this.var_table=true;
          this.varVar=this.varVar_inter;
          this.showVar=true;
          this.nomVar=this.getName(this.varVar);
          this.unitVar=this.getUnit(this.varVar);
          this.getLineChartLabels();
          console.log(this.lineChartLabels);
          var n=this.lineChartLabels.length;

          for(var i=0;i<n;i++){
          if(i==0){
              var rInit=this.v[this.idCal];
          }
          else {
              rInit=this.lineChartData[i-1];
          }
          console.log("rInit dans form: "+rInit);
          this.v[this.varVar]=this.lineChartLabels[i];
          this.lineChartData.push(this.calculate(rInit));

          }
          this.v[this.varVar]=this.getValue(this.varVar);
          this.getChartData();
          console.log(this.lineChartData);
          this.getOptions();
      }
                    
      else{
          this.var_table=false;
          this.showVar=false;
          console.log("in else");
          rInit=this.v[this.idCal];
          console.log("rInit dans form: "+rInit);
          this.result=this.calculate(rInit);
      }
  }
  
  /**
   * Method called by the extended classes that does the calculations
   */
  calculate(rInit) {
    return null;
  }

  /**
   * Method that forbids the non-numeric inputs  
   */
  isNumber(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57))) {
          return false;
      }
      return true;
  }

}