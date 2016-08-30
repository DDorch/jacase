import {Formulaire} from '../common/formulaire';
import {Http,Response} from '@angular/http';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';

export class FormSection extends Formulaire {

    public jsonName;
    public saisies_comp;
    public tVarCal; // tableau des variables à calculer
    public sectionType;
    public selectedSection;
    public v_section;
    public v_bief;
    public selectSectionFields;

    constructor(public http: Http, jsonName:string){
        super(http,'section');
        this.param_composite=true;
        this.jsonName=jsonName;
        this.v_section={
            "1":{
                "Lf": 2.5,
                "F": 0.56
            },
            "2":{
                "Lf": 2.5
            },
            "3":{
                "D": 2
            },
            "4":{
                "C": 0.5,
                "Lb": 0.56
            }
        }
    }

    getFields(){
        super.getFields();
    }
    getSectionFields(){
         this.http.get("app/"+this.jsonName+"/"+this.jsonName+".config.json")
        .subscribe((res: Response) => {
            this.initJsonSection(res.json());
        });
    }

    initJsonVar(data){
        super.initJsonVar(data);
        for(var i=0; i<this.saisies.length; i++){
            if(this.saisies[i].id=='fs_section'){
                    this.sectionFields=this.saisies[i].fields[0];
                    this.sectionType=this.sectionFields.select[0].id;
                    this.selectedSection=this.sectionFields.select[this.sectionType-1];    
                    this.selectSectionFields=this.selectedSection.definition;
                
            }
        } 
        console.log(this.selectedSection);
    }     

    initJsonSection(data){
        //this.getFields();
        this.saisies_comp=data.saisies;
        this.saisies=this.saisies.concat(this.saisies_comp);
        this.initFields();
    }
    
    initFields(){
        for(var i=0; i<this.saisies.length; i++){
            if(this.saisies[i].id=='options'){
                this.idCal_inter=this.saisies[i].idCal;
            }
            if(this.saisies[i].fields){
                if(this.saisies[i].id=='fs_hydraulique'){
                    this.fields=this.saisies[i].fields;
                }
                if(this.saisies[i].id=='fs_param_calc'){
                    this.precision=this.saisies[i].fields[0].value;
                }
                if(this.saisies[i].id=='fs_bief'){
                    this.biefFields=this.saisies[i].fields;
                }
                
            }
        }
        this.fields=this.fields.concat(this.biefFields);
        this.fields=this.fields.concat(this.selectSectionFields);
        this.initGlob();
        this.initV();
        console.log(this.fields);
    }

    ngOnInit() {
        this.getFields();
        this.getSectionFields();
    }

    initVsection(){

    }
    sectionChange(value){
        this.sectionType=value;
        this.selectedSection=this.sectionFields.select[this.sectionType-1];
        this.selectSectionFields=this.selectedSection.definition;
        this.initFields();
        console.log(this.selectedSection);
    }
}
