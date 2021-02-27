import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

////////////////////////// I N T E R C E P T O R S ///////////////////////////
import { AuthInterceptor } from './interceptors/auth-interceptor';

////////////////////////// S E R V I C E S //////////////////////////////////
import { EleveService } from './services/eleve/eleve.service'
import { ClasseDEcoleService } from './services/classeDEcole/classe-d-ecole.service'
import { AuthService } from './services/auth/auth.service'
import { AuthGuardService } from './services/guards/auth-guard.service';

////////////////////////// C O M P O N E N T S /////////////////////////////
import { AppComponent } from './app.component';
import { GetAllEleveComponent } from './components/eleve/get-all-eleve/get-all-eleve.component';
import { GetOneEleveComponent } from './components/eleve/get-one-eleve/get-one-eleve.component';
import { NewEleveComponent } from './components/eleve/new-eleve/new-eleve.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { UpdateEleveComponent } from './components/eleve/update-eleve/update-eleve.component';

const appRoutes: Routes = [

    { path: 'eleves',
        children: [
            { path: 'all', component: GetAllEleveComponent },
            { path: 'single/:id', component: GetOneEleveComponent },
            { path: 'new', canActivate: [AuthGuardService], component: NewEleveComponent },
            { path: 'update/:id', canActivate: [AuthGuardService], component: UpdateEleveComponent },
            { path: '', pathMatch: 'full', redirectTo: 'all' },
            { path: '**', redirectTo: 'all' }
        ]  
    },
    { path: 'auth',
        children :[
            { path: 'signup', component: SignupComponent },
            { path: 'login', component: LoginComponent },
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: '**', redirectTo: 'login' }
        ]
    },
    { path: '', pathMatch: 'full', redirectTo: 'eleves/all' },
    { path: '**', redirectTo: 'eleves/all' }
];

@NgModule({
  declarations: [
    AppComponent,
    GetAllEleveComponent,
    GetOneEleveComponent,
    NewEleveComponent,
    LoginComponent,
    SignupComponent,
    UpdateEleveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    EleveService,
    ClasseDEcoleService,
    AuthService,
    AuthGuardService,
    {
        provide : HTTP_INTERCEPTORS,
        useClass : AuthInterceptor,
        multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
