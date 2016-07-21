import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class LoadJson{



    constructor(private http:Http) { }

     getFieldsAndOptions(nomForm:string) {
        var chemin:string="/app/"+nomForm+".json";
        return Observable.forkJoin(
            this.http.get(chemin).map((res:Response) => res.json().fields),
            this.http.get(chemin).map((res:Response) => res.json().idCal),
            this.http.get('/app/choix_var.json').map((res:Response) => res.json().options)

      );
  }

}