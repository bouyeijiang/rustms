import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SysUsersComponent } from './sys-users.component';
import { UserComponent } from './user/user.component';
import { SettingsComponent } from './settings/settings.component';
const routes: Routes = [
    {
        path: '',
        component: SysUsersComponent,
        children: [
            { path: 'user', component: UserComponent },
            { path: 'settings', component: SettingsComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SysUsersRoutingModule { }