import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  LayoutModule,
  AccordionModule,
  SearchModule,
  AvatarModule,
  BadgeModule,
  DropDownModule,
  FormModule,
  TabsModule,
  TextInputModule,
  ToggleModule,
  ButtonModule,
  DrawerModule,
  DCommonModule,
  AlertModule,
  ToastModule,
  TooltipModule,
  RadioModule,
  BreadcrumbModule,
  ModalModule,
  DatepickerModule,
  SelectModule,
  LoadingModule,
  InputNumberModule,
  TreeModule
} from 'ng-devui';
import { I18nModule } from 'ng-devui/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalizeComponent } from './components/personalize/personalize.component';
import { HeaderOperationComponent } from './components/header/header-operation/header-operation.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { DaGridModule} from './layouts/da-grid';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { DialogDeptComponent } from './components/dialog-dept/cdialog.component';
import { DialogUserComponent } from './components/dialog-user/cdialog.component';
import { DialogMenuComponent } from './components/dialog-menu/cdialog.component';
import { DialogRoleComponent } from './components/dialog-role/cdialog.component';
import { DialogRoleMRightComponent } from './components/dialog-role/dialog-role-mright/cdialog.component';
import { DialogRoleDetailComponent } from './components/dialog-role/dialog-role-detail/cdialog.component';
import { DialogRoleDRightComponent } from './components/dialog-role/dialog-role-dright/cdialog.component';

const DEVUI_MODULES = [
  LayoutModule,
  AccordionModule,
  SearchModule,
  AvatarModule,
  BadgeModule,
  DropDownModule,
  FormModule,
  TabsModule,
  TextInputModule,
  ToggleModule,
  ButtonModule,
  DrawerModule,
  BreadcrumbModule,
  RadioModule,
  ModalModule,
  DatepickerModule,
  SelectModule,
  ToastModule,
  LoadingModule,
  InputNumberModule,
  TreeModule
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  NavbarComponent,
  PersonalizeComponent
];
@NgModule({
  declarations: [
    LoginComponent,
    HeaderOperationComponent,
    HeaderLogoComponent,
    SideMenuComponent,
    DialogDeptComponent,
    DialogUserComponent,
    DialogMenuComponent,
    DialogRoleComponent,
    DialogRoleMRightComponent,
    DialogRoleDRightComponent,
    DialogRoleDetailComponent,
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    DCommonModule,
    AlertModule,
    ClipboardModule,
    ToastModule,
    TooltipModule,
    I18nModule,
    DaGridModule,
    ...DEVUI_MODULES
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HeaderLogoComponent,
    HeaderOperationComponent,
    I18nModule,
    DaGridModule,
    SideMenuComponent,
    ...DEVUI_MODULES,
    ...COMPONENTS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
