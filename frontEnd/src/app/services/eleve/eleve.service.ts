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

    getEleveAll() {

        return this.http.get<Eleve[]>('http://localhost:3000/api/eleves')
            .pipe(
                map(
                    (eleves : Eleve[]) => {
                        console.log(eleves);
                        
                        return eleves.map((one_eleve : Eleve) => {
                            console.log(new Eleve().deserialize(one_eleve));
                            
                            return new Eleve().deserialize(one_eleve);
                        })
                    }
                )

            )
        /* .pipe(
            map((res: Eleve[]) => { 
                
                res.map((one_eleve : Eleve) => {
                    console.log(new Eleve().deserialize(one_eleve));
                    
                    this.eleve.push(new Eleve().deserialize(one_eleve));
                })
            })
        ) */


        /* .subscribe(
        
            
             (eleve: Eleve[]) => {
                
                if (eleve) {
                    this.eleve = eleve;
                    this.emitEleveSubject();
                }
            },
            (error: any) => {
                console.log(error);
            } 
        ); */ 
    }

    emitEleveSubject(){
        this.eleve$.next(this.eleve)
    }
}
