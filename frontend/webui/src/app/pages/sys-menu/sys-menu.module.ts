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
import { MenuComponent } from './menu/menu.component';
import { SysMenuRoutingModule } from './sys-menu-routing.module';
import { SysMenuComponent } from './sys-menu.component';
@NgModule({
    declarations: [
        SysMenuComponent,
        MenuComponent
    ],
    imports: [
        DatepickerModule,
        InputNumberModule,
        PaginationModule,
        TooltipModule,
        DataTableModule,
        FormModule,
        SharedModule,
        SysMenuRoutingModule
    ],
})
export class SysMenuModule { }