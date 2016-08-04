import {Component} from '@angular/core';
import {Http,Response} from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'menu',
    //pipes: [PipeNumbers],
    templateUrl: 'app/main.html',
    directives : [ROUTER_DIRECTIVES]  
})

export class MainApp {

    public calculators;

    constructor(public http: Http){
 //   constructor(){
     
    }

    getCalculators(){
        this.http.get("/app/jacase.config.json")
          .subscribe((res: Response) => {
              this.calculators=res.json().calculators;
        });
    }
}