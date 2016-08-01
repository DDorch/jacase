import {Component} from '@angular/core';
import {Http,Response} from '@angular/http';


@Component({
    selector: 'main',
    //pipes: [PipeNumbers],
    //templateUrl: 'app/formulaire.html',
    //directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor]  
})

export class Main {

    public calculators;

    constructor(public http: Http){
        
    }

    getCalculators(){
        this.http.get("/app/jacase.config.json")
          .subscribe((res: Response) => {
              this.calculators=res.json().calculators;
        });
    }
}