import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AuthService } from './services/auth.service';
import { PersonalizeService } from './services/personalize.service';
import { CustomThemeService } from './services/custom-theme.service';
//import { MockDataModule } from './mock/mock-data.module';
import { AuthGuardService } from './services/auth-guard-service.guard';
import { SysUserService } from './services/sysuser.service';
import { SysDeptService } from './services/sysdept.service';
import { SysMenuService } from './services/sysmenu.service';
import { SysRoleService } from './services/sysrole.service';

// const DATA_SERVICES = [
//   { provide: AppUser, useClass: AuthService },
// ];

export const DEVUI_CORE_PROVIDERS = [
  //...MockDataModule.forRoot().providers!,
 // ...DATA_SERVICES,
  AuthService,
  PersonalizeService,
  AuthGuardService,
  CustomThemeService,
  SysUserService,
  SysDeptService,
  SysMenuService,
  SysRoleService
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...DEVUI_CORE_PROVIDERS],
    };
  }
}
