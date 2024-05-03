import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ImageGeneratorComponent } from './components/image-generator/image-generator.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ImageBlockListComponent } from './components/image-block-list/image-block-list.component';

//test
import { SelectImageComponent } from './components/select-image/select-image.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:localStorage.getItem('userId') ? '/imageList' : '/login',
        pathMatch:'full'    
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path: 'imageList',
        component: ImageBlockListComponent,
        title: 'Image List'
    },
    {
        path:'imageGenerator',
        component:ImageGeneratorComponent,
    },
    {
        path: 'signup',
        component: SignUpComponent
    },
    {
        path: 'setImage',
        component: SelectImageComponent
    },
    {
        path:'**',
        component:PageNotFoundComponent
    }
];