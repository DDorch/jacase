import {Formulaire} from '../common/formulaire';
import {Http,Response} from '@angular/http';


export class FormSection extends Formulaire {

    public jsonName;
    public saisies_comp;
    public tVarCal; // tableau des variables à calculer
    public sectionFields;
    public sectionType;
    public selectedSection;
    public v_section;

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
        this.http.get("app/section/"+this.jsonName+"/"+this.jsonName+".config.json")
        .subscribe((res: Response) => {
            this.initJsonSection(res.json());
        });
    }

    initJsonSection(data){
        this.saisies_comp=data.saisies;
        this.sectionFields=this.saisies_comp.fs_section.fields;
        this.sectionType=this.sectionFields.select[0].id;
        this.selectedSection=this.sectionFields.select[this.sectionType-1];
        this.saisies=this.saisies.concat(this.saisies_comp);
    }
    
    ngOnInit() {
        this.getFields();
    }

    sectionChange(value){
        this.sectionType=value;
        this.selectedSection=this.sectionFields.select[this.sectionType-1];
    }
}
