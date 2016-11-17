import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/index';
import { SignComponent } from './sign-component/sign.component';
import { LoginComponent } from './login-component/login.component';
import { SignRoutes } from './sign.routes';

@NgModule({
    imports: [ CommonModule,FormsModule,SignRoutes],
    providers: [],
    declarations: [
        SignComponent, LoginComponent
    ]
})
export class SignModule {}
