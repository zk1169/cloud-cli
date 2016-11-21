import {
    NgModule,
    ModuleWithProviders
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//import { DndModule } from 'ng2-dnd';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SelectModule } from 'ng2-select/ng2-select';

import { MwSearchComponent } from './components/mw-search-component/mw-search.component';
import { MwEventTableComponent } from './components/mw-event-table-component/mw-event-table.component';
import { MwDatetimeComponent } from './components/mw-datetime-component/mw-datetime.component';
import { MwAutocompleteComponent } from './components/mw-autocomplete-component/mw-autocomplete.component';
import { MwRadioComponent } from './components/mw-radio-component/mw-radio.component';
import { MwOrderItemComponent } from './components/mw-order-item-component/mw-order-item.component';
import { MwSelectItemComponent } from './components/mw-select-item-component/mw-select-item.component';
import { MwSelectPayItemComponent } from './components/mw-select-payitem-component/mw-select-payitem.component';
import { MwSelectEmployeeComponent } from './components/mw-select-employee-component/mw-select-employee.component';
import { MwFormComponent } from './components/mw-form-component/mw-form.component';
import { MwSelectComponent } from './components/mw-select-component/mw-select.component';
import { MwSelectFormComponent } from './components/mw-select-component/mw-select.component';
import { MwButtonComponent } from './components/mw-button-component/mw-button.component';
import { MwPaginationComponent } from './components/mw-pagination-component/mw-pagination.component';
import { MwTabHeaderComponent } from './components/mw-tab-header-component/mw-tab-header.component';
import { MwFormItemComponent } from './components/mw-form-item-component/mw-form-item.component';
import { MwQueryTagComponent } from './components/mw-query-tag-component/mw-query-tag.component';
import { MwTreeComponent } from './components/mw-tree-component/mw-tree.component';
import { MwCardRuleComponent } from './components/mw-card-rule-component/mw-card-rule.component';
import { MwImageComponent } from './components/mw-image-component/mw-image.component';
import { MwListSortComponent } from './components/mw-list-sort-component/mw-list-sort.component';
import { MwOrderDetailComponent } from './components/mw-order-detail-component/mw-order-detail.component';

import { MwCreateMemberDialog } from './components/mw-create-member-dialog/mw-create-member.dialog';
import { MwEditServiceItemDialog } from './components/mw-edit-service-item-dialog/mw-edit-service-item.dialog';
import { MwEditCardDialog } from './components/mw-edit-card-dialog/mw-edit-card.dialog';
import { MwCardRuleDialog } from './components/mw-card-rule-dialog/mw-card-rule.dialog';
import { MwOrderConfirmDialog } from './components/mw-order-confirm-dialog/mw-order-confirm.dialog';
import { MwOrderDetailDialog } from './components/mw-order-detail-dialog/mw-order-detail.dialog';

import { MwCurrencyPipe } from './pipes/mw-currency.pipe';
import { MwDatePipe,MwRelativeDatePipe } from './pipes/mw-date.pipe';
import { MwListPipe } from './pipes/mw-list.pipe';
import { MwTextFormatPipe } from './pipes/mw-text-format.pipe';
import { MwItemStatusPipe } from './pipes/mw-item-status.pipe';
import { MwCardTypePipe } from './pipes/mw-card-type.pipe';
import { MwCardRulePipe } from './pipes/mw-card-rule.pipe';
import { MwAppointTypePipe } from './pipes/mw-appoint-type.pipe';

import { MwBusyDirective } from './directives/mw-busy.directive';
import { MwCollapseDirective } from './directives/mw-collapse.directive';
import { MwFocusDirective } from './directives/mw-focus.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2BootstrapModule,
        SelectModule,
        RouterModule,
        //DndModule
    ],
    declarations: [
        MwSearchComponent,
        MwEventTableComponent,
        MwDatetimeComponent,
        MwAutocompleteComponent,
        MwRadioComponent,
        MwOrderItemComponent,
        MwSelectItemComponent,
        MwSelectPayItemComponent,
        MwSelectEmployeeComponent,
        MwFormComponent,
        MwSelectComponent,
        MwSelectFormComponent,
        MwButtonComponent,
        MwPaginationComponent,
        MwTabHeaderComponent,
        MwFormItemComponent,
        MwQueryTagComponent,
        MwTreeComponent,
        MwCardRuleComponent,
        MwImageComponent,
        MwListSortComponent,
        MwOrderDetailComponent,
        MwCreateMemberDialog,
        MwEditServiceItemDialog,
        MwEditCardDialog,
        MwCardRuleDialog,
        MwOrderConfirmDialog,
        MwOrderDetailDialog,
        MwCurrencyPipe,
        MwDatePipe,
        MwRelativeDatePipe,
        MwListPipe,
        MwTextFormatPipe,
        MwItemStatusPipe,
        MwCardTypePipe,
        MwCardRulePipe,
        MwAppointTypePipe,
        MwBusyDirective,
        MwCollapseDirective,
        MwFocusDirective
    ],
    exports: [
        CommonModule,
        FormsModule,
        Ng2BootstrapModule,
        MwSearchComponent,
        MwEventTableComponent,
        MwDatetimeComponent,
        MwAutocompleteComponent,
        MwRadioComponent,
        MwOrderItemComponent,
        MwSelectItemComponent,
        MwSelectPayItemComponent,
        MwSelectEmployeeComponent,
        MwFormComponent,
        MwSelectComponent,
        MwSelectFormComponent,
        MwButtonComponent,
        MwPaginationComponent,
        MwTabHeaderComponent,
        MwFormItemComponent,
        MwQueryTagComponent,
        MwTreeComponent,
        MwCardRuleComponent,
        MwImageComponent,
        MwListSortComponent,
        MwOrderDetailComponent,
        MwCreateMemberDialog,
        MwEditServiceItemDialog,
        MwEditCardDialog,
        MwCardRuleDialog,
        MwOrderConfirmDialog,
        MwOrderDetailDialog,
        DatePipe,
        MwCurrencyPipe,
        MwDatePipe,
        MwRelativeDatePipe,
        MwListPipe,
        MwTextFormatPipe,
        MwItemStatusPipe,
        MwCardTypePipe,
        MwCardRulePipe,
        MwAppointTypePipe,
        MwBusyDirective,
        MwCollapseDirective,
        MwFocusDirective
    ]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
