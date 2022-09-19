import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/@shared/shared.module';
import { PortalComponent } from './portal/portal.component';
import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';
import { AnalysisPieComponent } from './portal/analysis-pie/analysis-pie.component';
import { EchartsModule } from 'src/app/@shared/components/echarts/echarts.module';

@NgModule({
  declarations: [GettingStartedComponent, PortalComponent,AnalysisPieComponent],
  imports: [SharedModule, GettingStartedRoutingModule,EchartsModule],
  providers: [],
})
export class GettingStartedModule { }
