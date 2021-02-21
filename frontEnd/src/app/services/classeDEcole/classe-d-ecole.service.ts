import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ClasseDEcole } from 'src/app/models/ClasseDEcole.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClasseDEcoleService {

    constructor(private http: HttpClient) { }

    public classeDEcole: ClasseDEcole[] = [];

    public classeDEcole$ = new Subject<ClasseDEcole[]>();

    /**
     * Afficher tous les classes de l'école
     * 
     * @returns {Observable<ClasseDEcole[]>}
     */
    getClasseDEcoleAll(): Observable<ClasseDEcole[]> {

        return this.http.get<ClasseDEcole[]>('http://localhost:3000/api/classe_d_ecoles')
            .pipe(
                map(
                    (classes : ClasseDEcole[]) => {

                        return classes.map((one_classe : ClasseDEcole) => {

                            return new ClasseDEcole().deserialize(one_classe);
                        });
                    }
                )
            )
        ;
    }

    emitClasseDEcoleSubject(){
        this.classeDEcole$.next(this.classeDEcole)
    }
}
