import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inputApp', pathMatch: 'full' },
  { path: 'inputApp', component: AppComponent },
];
