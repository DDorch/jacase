import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {FORM_DIRECTIVES} from "@angular/common";

@Component({
    selector: 'formu',
    //templateUrl: 
    //directives : 
})

export abstract class Formulaire {
    
    public fields;
    public v = new Object();
    public result;
    public glob; // état des radios
    public glob_before={}; //état des radios avant le binding

    constructor(public http: Http){
        
    }

  


}