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

    public link : string = 'http://localhost:3000/api/eleves/';

    

    /**
     * Afficher tous les élèves de l'école
     * 
     * @returns {Observable<Eleve[]>}
     */
    getEleveAll(): Observable<Eleve[]> {

        return this.http.get<Eleve[]>(this.link)
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

    /**
     * Afficher un élève par son id
     * 
     * @param {string} id 
     * @returns {Observable<Eleve>}
     */
    getEleveById(id: string) : Observable<Eleve> {

        return this.http.get<Eleve>(this.link + id)
            .pipe(
                map(
                    (eleve : Eleve) => {
                        return new Eleve().deserialize(eleve);
                    }
                )
            )
        ;
    }

    /**
     * Creer un nouveau élève
     * 
     * @param {Eleve} eleve 
     */
    createNewEleve(eleve : Eleve) {

        return new Promise((resolve, reject) => {

            this.http.post(this.link, eleve).subscribe(
                (response) => {
                    console.log(response);
                    alert('Le nouvel élève a bien été enregistré')
                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Modifier un élève
     *  
     * @param {string} id 
     * @param {Eleve} eleve 
     * 
     * @returns {Observable<Eleve>} eleve 
     */
    updateEleve(id : string, eleve : Eleve) : Observable<Eleve>
    {
        return this.http.put<Eleve>(this.link + id, eleve)
            .pipe(
                map(
                    (eleve : Eleve) => {

                        return eleve;
                    }
                )
            )
        ;
    }

    /**
     * Supprimer un élève
     * 
     * @param {string} id
     * 
     * @returns {Observable<any>}
     */
    deleteEleve(id : string) : Observable<any>
    {
        return this.http.delete<any>(this.link + id)
            .pipe(
                map(
                    (response) => {
                        
                        return response;
                    }
                )
            )
        ;
    }
}
