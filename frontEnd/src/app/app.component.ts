import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    
    public isAuth : boolean;

    private isAuthSubscription : Subscription;

    constructor(
        private authService : AuthService,
        private router : Router,
    ){}

    ngOnInit()
    {
        this.isAuthSubscription = this.authService.isAuth$.subscribe(
            (auth) => {
                this.isAuth = auth;
            }
        );
    }

    onLogout()
    {
        this.authService.logout();
        this.router.navigate(['eleves/all']);
    }
    
    ngOnDestroy()
    {
        this.isAuthSubscription.unsubscribe();
    }
}
