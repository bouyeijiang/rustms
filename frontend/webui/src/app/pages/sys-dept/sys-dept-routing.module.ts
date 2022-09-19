import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SysDeptComponent } from './sys-dept.component';
import { DeptComponent } from './dept/dept.component';
const routes: Routes = [
    {
        path: '',
        component: SysDeptComponent,
        children: [
            { path: 'dept', component: DeptComponent }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SysDeptRoutingModule { }