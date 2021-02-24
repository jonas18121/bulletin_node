import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService : AuthService,
        private router : Router
    ) {}

    
    intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
        
        if (this.authService.isAuth$.value) {
        
            const authToken = this.authService.token;

            request = request.clone(
                {
                    headers : request.headers.set('Authorization', 'Bearer ' + authToken)
                }
            );
        }
        else{
            // this.router.navigate(['auth/login']); redirige vers la page login si on est pas connecter
            // ça fonctionne partout dans l'application
            // donc à utiliser seulemnent si l'user ne peut pas avoir accès à rien dans l'application sans être connecter
            
            // this.router.navigate(['auth/login']);
        }
        return next.handle(request);
    }
}