import {Formulaire} from '../common/formulaire';
import {Http,Response} from '@angular/http';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import {acSection, cParam} from './section_type';
import {cLog} from './log';
import {cSnTrapez} from './section_trapez';
import {cSnRectang} from './section_rectang';
import {cSnCirc} from './section_circulaire';
import {cSnPuiss} from './section_puissance';


export class FormSection extends Formulaire {
    
    public oLog: cLog;
    protected Sn : acSection; ///< Objet section
    protected oP : cParam; ///< Objet paramètres de section
    public jsonName;
    public saisies_comp;
    public tVarCal; // tableau des variables à calculer
    public sectionType;
    public selectedSection;
    public v_section;
    public v_bief;
    public selectSectionFields;
    public limitFields;

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

    }     

    initJsonSection(data){
        this.saisies_comp=data.saisies;
        this.saisies=this.saisies.concat(this.saisies_comp);
        this.option=this.saisies[2].option;
        console.log(this.option);
        this.initFields();
    }
    
    initFields(){
        for(var i=0; i<this.saisies.length; i++){
            if(this.saisies[i].id=='options'){
                this.idCal_inter=this.saisies[i].idCal;
            }
            if(this.saisies[i].fields){
                if(this.saisies[i].id=='fs_hydraulique'){
                    var f=this.saisies[i].fields;
                }
                if(this.saisies[i].id=='fs_param_calc'){
                    this.precision=this.saisies[i].fields[0].value;
                }
                if(this.saisies[i].id=='fs_bief'){
                    this.biefFields=this.saisies[i].fields;
                }
                if(this.saisies[i].id=="fs_limites"){
                    this.limitFields=this.saisies[i].fields;
                }                
            }
        }
        this.fields=this.selectSectionFields;
        this.fields=this.fields.concat(this.biefFields);
        if(this.limitFields) this.fields=this.fields.concat(this.limitFields);
        if(f) this.fields=this.fields.concat(f);
        console.log(this.fields);
        this.initGlob();
        this.initV();
        this.init_section_param();
    }

    ngOnInit() {
        this.getFields();
        this.getSectionFields();
    }

    sectionChange(value){
        this.sectionType=value;
        this.selectedSection=this.sectionFields.select[this.sectionType-1];
        this.selectSectionFields=this.selectedSection.definition;
        this.initFields();
        //this.init_section_param();
    }

    init_section_param() {

        this.oP=new cParam(this.v['Ks'], this.v['Q'], this.v['If'], this.precision, this.v['YB']);
        switch(this.sectionType) {
                case '1':
                    this.Sn = new cSnTrapez(this.oLog,this.oP,this.v['Lf'],this.v['F']);
                    break;
                case '2':
                    console.log("in rect");
                    this.Sn = new cSnRectang(this.oLog,this.oP,this.v['Lf']);
                    break;
                case '3':
                    this.Sn = new cSnCirc(this.oLog,this.oP,this.v['D']);
                    break;
                case '4':
                    this.Sn = new cSnPuiss(this.oLog,this.oP,this.v['K'],this.v['LB']);
                    break;
                default:
                    this.Sn = new cSnTrapez(this.oLog,this.oP,this.v['Lf'],this.v['F']);
        }
        this.Sn.Y = this.v['Y'];        
        
    }
}
