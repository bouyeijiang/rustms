import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SysRoleComponent } from './sys-role.component';
import { RoleComponent } from './role/role.component';
const routes: Routes = [
    {
        path: '',
        component: SysRoleComponent,
        children: [
            { path: 'role', component: RoleComponent }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SysRoleRoutingModule { }