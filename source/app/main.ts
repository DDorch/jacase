import {Component} from '@angular/core';
import {Http,Response} from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MdButton} from '@angular2-material/button';

@Component({
    selector: 'menu',
    //pipes: [PipeNumbers],
    templateUrl: 'app/main.html',
    directives : [ROUTER_DIRECTIVES,MD_SIDENAV_DIRECTIVES,MD_LIST_DIRECTIVES,MdToolbar,MdIcon,MdButton],
    providers: [MdIconRegistry],  
})

export class MainApp {

    public calculators;

    constructor(public http: Http){
     
    }

    getCalculators(){
        this.http.get("/app/jacase.config.json")
          .subscribe((res: Response) => {
              this.calculators=res.json().calculators;
        });
    }
    ngOnInit(){
        this.getCalculators();
    }
}