import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../@shared/components/abnormal/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'getting-started',
        loadChildren: () =>
          import('./getting-started/getting-started.module').then(
            (m) => m.GettingStartedModule
          )
      },{
        path: 'sys-users',
        loadChildren: () =>
          import('./sys-users/sys-users.module').then(
            (m) => m.SysUsersModule
          )
      }, {
        path: 'sys-dept',
        loadChildren: () =>
          import('./sys-dept/sys-dept.module').then(
            (m) => m.SysDeptModule
          )
      },
      {
        path: 'sys-role',
        loadChildren: () =>
          import('./sys-role/sys-role.module').then(
            (m) => m.SysRoleModule
          )
      },
      {
        path: 'sys-menu',
        loadChildren: () =>
          import('./sys-menu/sys-menu.module').then(
            (m) => m.SysMenuModule
          )
      },
      {
        path: '',
        redirectTo: 'getting-started',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
