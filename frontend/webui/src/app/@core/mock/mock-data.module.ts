import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUserService } from '../services/appuser.service';
import { SysUserService } from '../services/sysuser.service';
import { SysDeptService } from '../services/sysdept.service';

const SERVICES = [
  AppUserService,
  SysUserService,
  SysDeptService
];

@NgModule({
  imports: [CommonModule],
  providers: [...SERVICES],
})
export class MockDataModule {
  static forRoot(): ModuleWithProviders<MockDataModule> {
    return {
      ngModule: MockDataModule,
      providers: [...SERVICES],
    };
  }
}
