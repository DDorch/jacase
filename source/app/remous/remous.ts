import {Component} from '@angular/core';
import {FormSection} from '../section/section';
import {FORM_DIRECTIVES,CORE_DIRECTIVES} from '@angular/common';
import {RadioControlValueAccessor} from '../common/radio_value_accessor';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import {Http} from '@angular/http';
import {PipeNumbers} from '../common/pipe_numbers';
import {PipeNumberValidator} from '../common/pipe_number_validator';

@Component({
    selector: 'jacase',
    pipes: [PipeNumbers,PipeNumberValidator],
    templateUrl: 'app/common/formulaire.html',
    styleUrls:['app/main.css'],
    directives : [CHART_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, RadioControlValueAccessor, FormSection],
})

export class FormRemous extends FormSection {
    
    constructor(public http: Http){
        super(http,'remous');
    }
    
    calculate(){
    }
}