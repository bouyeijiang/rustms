import { NgModule } from '@angular/core';
import {
    DatepickerModule,
    InputNumberModule,
    PaginationModule,
    TooltipModule,
    DataTableModule,
    FormModule
} from 'ng-devui';
import { SharedModule } from 'src/app/@shared/shared.module';
import { DeptComponent } from './dept/dept.component';
import { SysDeptRoutingModule } from './sys-dept-routing.module';
import { SysDeptComponent } from './sys-dept.component';
@NgModule({
    declarations: [
        SysDeptComponent,
        DeptComponent
    ],
    imports: [
        DatepickerModule,
        InputNumberModule,
        PaginationModule,
        TooltipModule,
        DataTableModule,
        FormModule,
        SharedModule,
        SysDeptRoutingModule
    ],
})
export class SysDeptModule { }