import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignComponent } from './sign-component/sign.component';
import { LoginComponent } from './login-component/login.component';

const routes: Routes = [{
    path: 'sign',
    component: SignComponent,
    children: [
    	{ path: '', redirectTo: 'login', pathMatch: 'full'},
        { path: 'login', component: LoginComponent }
    ]
}];

export const SignRoutes: ModuleWithProviders = RouterModule.forChild(routes);
