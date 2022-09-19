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
import { RoleComponent } from './role/role.component';
import { SysRoleRoutingModule } from './sys-role-routing.module';
import { SysRoleComponent } from './sys-role.component';
@NgModule({
    declarations: [
        SysRoleComponent,
        RoleComponent
    ],
    imports: [
        DatepickerModule,
        InputNumberModule,
        PaginationModule,
        TooltipModule,
        DataTableModule,
        FormModule,
        SharedModule,
        SysRoleRoutingModule
    ],
})
export class SysRoleModule { }