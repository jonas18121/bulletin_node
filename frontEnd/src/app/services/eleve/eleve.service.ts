import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Eleve } from '../../models/Eleve.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

    constructor(private http: HttpClient) { }

    public eleve: Eleve[] = [];

    public eleve$ = new Subject<Eleve[]>();

    

    getEleveAll(): Observable<Eleve[]> {

        return this.http.get<Eleve[]>('http://localhost:3000/api/eleves')
            .pipe(
                map(
                    (eleves : Eleve[]) => {

                        return eleves.map((one_eleve : Eleve) => {

                            return new Eleve().deserialize(one_eleve);
                        });
                    }
                )
            )
        ;
    }

    emitEleveSubject(){
        this.eleve$.next(this.eleve)
    }

    getEleveById(id: string) : Observable<Eleve>{

        return this.http.get<Eleve>('http://localhost:3000/api/eleves/' + id)
            .pipe(
                map(
                    (eleve : Eleve) => {

                        return new Eleve().deserialize(eleve);
                    }
                )
            )

        /* return new Promise((resolve, reject) => {

            this.http.get('http://localhost:3000/api/eleves/' + id).subscribe(
                (response) => {
                    console.log(resolve(response));
                    
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        }); */
    }
}
