import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SysMenuComponent } from './sys-menu.component';
import { MenuComponent } from './menu/menu.component';
const routes: Routes = [
    {
        path: '',
        component: SysMenuComponent,
        children: [
            { path: 'menu', component: MenuComponent }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SysMenuRoutingModule { }