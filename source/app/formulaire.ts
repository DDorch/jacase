import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'formu',
    //templateUrl: 
    //directives : 
})

export abstract class Formulaire {
    
    public fields;
    public v = new Object();
    public result;

    constructor(public http: Http){
        
    }




}