import { Component, OnInit, Renderer2 } from '@angular/core';
import { DialogService } from 'ng-devui/modal';
import { DrawerService, IDrawerOpenResult } from 'ng-devui/drawer';
import { Subject } from 'rxjs';
import { takeUntil, timeout } from 'rxjs/operators';
import { PersonalizeComponent } from '../@shared/components/personalize/personalize.component';
import { PersonalizeService } from '../@core/services/personalize.service';
//import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DaLayoutConfig, DaLayoutService } from '../@shared/layouts/da-layout';
import { DaScreenMediaQueryService } from '../@shared/layouts/da-grid';
import { SideMenuComponent } from '../@shared/components/side-menu/side-menu.component';
import { Theme } from 'ng-devui/theme';
//import getMenu from './menus';
import { SysMenuService } from '../@core/services/sysmenu.service';

@Component({
  selector: 'da-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  private destroy$: Subject<void> = new Subject();
  menu: any;

  layoutConfig: DaLayoutConfig;
  isSidebarShrink: boolean = false;
  isSidebarFold: boolean = false;

  sideDrawer: IDrawerOpenResult;

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private personalizeService: PersonalizeService,
    private layoutService: DaLayoutService,
    private mediaQueryService: DaScreenMediaQueryService,
    private render2: Renderer2,
    private menuService:SysMenuService,
    // private translate: TranslateService
  ) {
    this.personalizeService.initTheme();
    this.layoutService
      .getLayoutConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe((config: DaLayoutConfig) => {
        this.layoutConfig = config;
        this.isSidebarShrink = !!this.layoutConfig.sidebar['shrink'];
      });

    this.mediaQueryService
      .getPoint()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ currentPoint, change, compare }) => {
        /* ml：sidebar shrink breakpoint */
        if (change <= 0 && compare['ml'] <= 0) {
          this.sidebarShrink(true);
        } else if (change >= 0 && compare['ml'] > 0) {
          this.sidebarShrink(false);
        }

        /* mm：sidebar hidden breakpoint */
        if (change <= 0 && compare['mm'] <= 0) {
          this.sidebarFold(true);
        } else if (change >= 0 && compare['mm'] > 0) {
          this.sidebarFold(false);
        }
      });
  }

  ngOnInit() {

    //加载数据库菜单配置
    //this.menu=getMenu(null);
    this.menuService.getMemnuByUserId((res)=>{
      if(res.code===200){
        setTimeout(()=>{
          let r_menus=res.value.children;
          this.rebuildMenu(r_menus);
          this.menu=r_menus;
        });
      }else{
        console.log(res.value);
      }
    });

    

    //屏蔽多语言菜单,没有使用到
    // this.translate
    //   .get('page')
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //    this.updateMenu(res);
    //   });

    // this.translate.onLangChange
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((event: TranslationChangeEvent) => {
    //     const values = this.translate.instant('page');
    //      this.updateMenu(values);
    //   });

    this.personalizeService.getUiTheme()!.subscribe((theme) => {
      const currentTheme = Object.values(
        (window as { [key: string]: any })['devuiThemes']
      ).find((i: Theme | unknown) => {
        return (i as Theme).id === theme;
      });
      if (currentTheme && (<any>currentTheme).isDark) {
        this.render2.addClass(document.body, 'is-dark');
      } else {
        this.render2.removeClass(document.body, 'is-dark');
      }
    })
  }

  rebuildMenu(data){
    for(let i=0;i<data.length;++i){
      delete data[i].mindex;
      delete data[i].pid;
      delete data[i].menu_type;
      delete data[i].id;

      if(data[i].children.length===0){
        delete data[i].children;
        delete data[i].open;
      }else{
        this.rebuildMenu(data[i].children);
      }
    }
  }

  // updateMenu(values: any) {
  //   this.menu = getMenu(values);
  // }

  openSideMenuDrawer() {
    this.drawerService.open({
      drawerContentComponent: SideMenuComponent,
      width: '240px',
      position: 'left' /* TODO: if destroyOnHide is false, there has some problem, waiting ng-devui bug fix*/,
      // destroyOnHide: false,
      data: {
        data: this.menu,
      },
    });
  }

  personalizeConfig() {
    const result = this.dialogService.open({
      id: 'theme',
      width: '800px',
      maxHeight: '800px',
      title: '',
      content: PersonalizeComponent,
      backdropCloseable: true,
      onClose: () => { },
      buttons: [],
    });
  }

  sidebarShrink(isShrink: boolean) {
    this.isSidebarShrink = isShrink;

    if (this.layoutConfig.sidebar.firSidebar) {
      this.layoutConfig.sidebar.firSidebar.width = this.isSidebarShrink
        ? 54
        : 240;
    }
    this.layoutConfig.sidebar['shrink'] = this.isSidebarShrink;
    this.layoutService.updateLayoutConfig(this.layoutConfig);
  }

  sidebarFold(isFold: boolean) {
    this.isSidebarFold = isFold;

    if (this.layoutConfig.sidebar.firSidebar) {
      this.layoutConfig.sidebar.firSidebar.hidden = isFold;
      this.layoutService.updateLayoutConfig(this.layoutConfig);
    }
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}