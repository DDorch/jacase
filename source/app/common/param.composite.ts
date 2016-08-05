import {Component,Input} from '@angular/core';
@Component({
    selector: "param_composite",
    templateUrl: 'app/common/param.composite.html',
    styles: [`
       .result_fix {
           font-weight: bold;
        }
    `],
    
})
export class ParamComposite{
    @Input() saisies;
    @Input() v_mat;
    @Input() selectedType;
    
    constructor(){
        this.v_mat={
            "L": 1.863,
            "M": 2,
            "N": 5.33
        };
    }

    onChange(value){
        this.selectedType=value;
        var types=this.saisies.fs_materiau.types;
        var length=types.length;
        for(var type of types){
            if(this.selectedType==type.id){
                this.v_mat['L']=type.parameters[0].value;
                this.v_mat['M']=type.parameters[1].value;
                this.v_mat['N']=type.parameters[2].value;
            }
        }
    }

}