import {Component} from '@angular/core';
import {Formulaire} from '../common/formulaire';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';

@Component({
    selector: 'lechapt_calmon',
    pipes: [PipeNumbers],
    //templateUrl: 'app/formulaire.html',
    //directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor],
})

export class FormLechaptCalmon extends Formulaire {
    

    constructor(public http: Http){
        super(http,'lechapt_calmon');
    }
    
    calculate(){
        
        
    }
}

