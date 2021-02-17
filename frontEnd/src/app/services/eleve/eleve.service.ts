import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Eleve } from '../../models/Eleve.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

    constructor(private http: HttpClient) { }

    public eleve: Eleve[];

    public eleve$ = new Subject<Eleve[]>();

    getEleve() {

        this.http.get('http://localhost:3000/api/eleves').subscribe(
            
            (eleve: Eleve[]) => {
                
                if (eleve) {
                    this.eleve = eleve;
                    this.emitEleveSubject();
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }

    emitEleveSubject(){
        this.eleve$.next(this.eleve)
    }
}
