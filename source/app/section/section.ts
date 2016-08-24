import {Formulaire} from '../common/formulaire';
import {Http,Response} from '@angular/http';

export class FormSection extends Formulaire {

    public jsonName;
    public saisies_comp;
    public tVarCal; // tableau des variables à calculer

    constructor(public http: Http, jsonName:string){
        super(http,'section');
        this.param_composite=true;
        this.jsonName=jsonName;
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
        this.saisies=this.saisies.concat(this.saisies_comp);
    }
    
    ngOnInit() {
        this.getFields();
    }
}
