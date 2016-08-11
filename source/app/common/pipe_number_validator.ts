import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'PipeNumberValidator',
    pure: false
})

export class PipeNumberValidator{

    transform(value) {
        const isNumeric = n => n === '-' || !isNaN(parseFloat(n)) && isFinite(n);
        return new String(isNumeric(value) ? value : value.slice(0, -1));
    }
}