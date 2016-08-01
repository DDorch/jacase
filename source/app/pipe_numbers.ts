import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'PipeNumbers'
})

export class PipeNumbers{

     transform(value, precision){
         var n = -Math.log10(precision);
         return Number(value).toFixed(n);
     }
}