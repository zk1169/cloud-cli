import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardProComponent } from './dashboard-pro-component/dashboard-pro.component';
import { DashboardLiteComponent } from './dashboard-lite-component/dashboard-lite.component';
import { OrderComponent } from './order-component/order.component';
import { BookingTableComponent } from './booking-table-component/booking-table.component';
import { OrderListComponent } from './order-list-component/order-list.component';
import { ServiceItemListComponent } from './service-item-list-component/service-item-list.component';
import { CardListComponent } from './card-list-component/card-list.component';
import { 
    AuthGuard,
    CanDeactivateGuard,
    AuthService
} from '../../shared/index';
import { OrderResolve } from './order-component/order-resolve.service';
import { DashboardProResolve } from './dashboard-pro-component/dashboard-pro-resolve.service';


const routes: Routes = [
{
    path: '', redirectTo: 'dashboard-pro/order',pathMatch: 'full'
},
{
    path: 'dashboard-pro',
    component: DashboardProComponent,
    resolve:[DashboardProResolve],
    children: [
        { path: '', redirectTo: 'order', pathMatch: 'full' },
        { path: 'order', component: OrderComponent, canActivate:[AuthGuard]},
        //type:1-id=订单id;2-预约单id;3-会员id,综合消费;4-会员id,开卡;
        { path: 'order/:type/:id', component: OrderComponent, canActivate:[AuthGuard],resolve:[OrderResolve] },
        //{ path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
        { path: 'booking-table', component: BookingTableComponent, canActivate: [AuthGuard] },
        { path: 'service-item-list', component: ServiceItemListComponent, canActivate: [AuthGuard] },
        { path: 'card-list', component: CardListComponent, canActivate: [AuthGuard] },
        { path: 'order-list/:type', component: OrderListComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }
    ]
}
, {
    path: 'dashboard-lite',
    component: DashboardLiteComponent,
    children: [
        { path: '', redirectTo: 'order', pathMatch: 'full' },
        //{ path: 'order', component: OrderComponent, canActivate:[AuthGuard],resolve:[OrderResolve] },
        { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
        { path: 'booking-table', component: BookingTableComponent, canActivate: [AuthGuard] },
        { path: 'service-item-list', component: ServiceItemListComponent, canActivate: [AuthGuard] },
        { path: 'order-list/:type', component: OrderListComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }
    ]
}
];

export const DashboardRoutes: ModuleWithProviders = RouterModule.forChild(routes);
