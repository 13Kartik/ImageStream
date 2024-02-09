import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/signup',
        pathMatch: 'full'
    },
    {
        path: 'signup',
        component: SignUpComponent
    },
];
