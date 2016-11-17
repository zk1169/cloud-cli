import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { ToasterModule } from 'angular2-toaster/angular2-toaster';

import { AppRoute } from './app.routes';
import { DashboardModule }   from './dashboard/dashboard.module';
import { SignModule }   from './sign/sign.module';
import { AppComponent } from './app-component/app.component';
import { 
  HttpService,
  CommonService,
  AuthService,
  UserService,
  DialogService,
  SharedModule,
  EventBus,
  MwLoadingBarService
} from '../shared/index';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    ToasterModule,
    AppRoute,
    CoreModule.forRoot(),
    DashboardModule,
    SignModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    HttpService,
    CommonService,
    AuthService,
    UserService,
    DialogService,
    EventBus
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
