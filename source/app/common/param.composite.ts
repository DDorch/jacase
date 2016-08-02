import {Component,Input} from '@angular/core';
@Component({
    selector: "param_composite",
    templateUrl: 'app/common/param.composite.html',
    
})
export class ParamComposite{
    @Input() saisies;

    constructor(){
    }
   

}