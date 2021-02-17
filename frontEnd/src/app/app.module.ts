import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GetAllEleveComponent } from './components/eleve/get-all-eleve/get-all-eleve.component';

const appRoutes: Routes = [

    { path: 'eleves',
        children: [
            { path: 'all', component: GetAllEleveComponent },
            { path: '', pathMatch: 'full', redirectTo: 'all' },
            { path: '**', redirectTo: 'all' }
        ]  
    },
    { path: '', pathMatch: 'full', redirectTo: 'eleves/all' },
    { path: '**', redirectTo: 'eleves/all' }
];

@NgModule({
  declarations: [
    AppComponent,
    GetAllEleveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
