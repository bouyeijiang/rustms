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
import { UserComponent } from './user/user.component';
import { SettingsComponent } from './settings/settings.component';

import { SysUsersRoutingModule } from './sys-users-routing.module';

import { SysUsersComponent } from './sys-users.component';
@NgModule({
    declarations: [
        SysUsersComponent,
        UserComponent,
        SettingsComponent
    ],
    imports: [
        DatepickerModule,
        InputNumberModule,
        PaginationModule,
        TooltipModule,
        DataTableModule,
        FormModule,
        SharedModule,
        SysUsersRoutingModule
    ],
})
export class SysUsersModule { }