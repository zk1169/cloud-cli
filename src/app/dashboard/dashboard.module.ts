import { NgModule }           from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
  SharedModule,
  AuthGuard,
  CanDeactivateGuard,
  OrderService,
  ServiceItemService,
  CardService,
  MemberService,
  EmployeeService
}       from '../../shared/index';
import { OrderResolve } from './order-component/order-resolve.service';
import { DashboardProResolve } from './dashboard-pro-component/dashboard-pro-resolve.service';

import { IndexComponent }      from './index-component/index.component';
import { DashboardProComponent }      from './dashboard-pro-component/dashboard-pro.component';
import { DashboardLiteComponent }      from './dashboard-lite-component/dashboard-lite.component';
import { OrderComponent }      from './order-component/order.component';
import { OrderListComponent }      from './order-list-component/order-list.component';
import { BookingTableComponent }      from './booking-table-component/booking-table.component';
import { ServiceItemListComponent }      from './service-item-list-component/service-item-list.component';
import { CardListComponent }      from './card-list-component/card-list.component';
import { DashboardRoutes }            from './dashboard.routes';


@NgModule({
  imports: [ SharedModule, DashboardRoutes ],
  declarations: [
    DashboardProComponent,
    DashboardLiteComponent,
    IndexComponent,
    OrderComponent,
    OrderListComponent,
    BookingTableComponent,
    ServiceItemListComponent,
    CardListComponent
  ],
  providers:[
    AuthGuard,
    CanDeactivateGuard,
    OrderResolve,
    DashboardProResolve,
    OrderService,
    ServiceItemService,
    CardService,
    MemberService,
    EmployeeService
  ]
})
export class DashboardModule { }