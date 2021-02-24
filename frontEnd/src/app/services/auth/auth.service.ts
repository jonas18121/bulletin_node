import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    public isAuth$ = new BehaviorSubject<boolean>(false);
    public token : string;
    public userId : string;
    public link : string = 'http://localhost:3000/api/auth';

    constructor(
        private http : HttpClient
    ) { }

    createNewUser(email: string, password: string) 
    {
        return new Promise(
            (resolve, reject) => {

                this.http.post(this.link + '/signup', { email : email, password : password })
                    .subscribe(
                        () => {
                            this.login(email, password).then(
                                (response) => {
                                    resolve(response);
                                }
                            )
                            .catch(
                                (error) => {
                                    reject(error);
                                }
                            );
                        },
                        (error) => {
                            reject(error);
                        }
                    )
                ;
            }
        ); 
    }

    login(email : string, password : string)
    {
        return new Promise(
            (resolve, reject) => {

                this.http.post(this.link + '/login', { email : email, password : password })
                    .subscribe(
                        (authData: { token : string, userId : string }) => {
                            
                            this.token = authData.token;
                            this.userId = authData.userId;
                            this.isAuth$.next(true);

                            resolve(authData);
                        },
                        (error) => {
                            reject(error);
                        }
                    )
                ;
            }
        );
    }

    logout() 
    {
        this.isAuth$.next(false);
        this.token = null;
        this.userId = null;
    }
}

/**
 * jeanregistre@gmail.com
 * jeanregistre
 */