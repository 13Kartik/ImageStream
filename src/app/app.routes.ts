import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImageGeneratorComponent } from './components/user/image-generator/image-generator.component';
import { UserComponent } from './components/user/user.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'/login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'user',
        component:UserComponent,
        children:[{
            path:'ImageGenerator',
            component:ImageGeneratorComponent
        }]
    },
    {
        path: 'signup',
        component: SignUpComponent
    },
    {
        path:'**',
        component:PageNotFoundComponent
    }
];