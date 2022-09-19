import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { I18nService } from 'ng-devui/i18n';
import { Subject } from 'rxjs';
import { DValidateRules, LoadingService, ToastService } from 'ng-devui';
import { takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { ThemeType } from '../../models/theme';
import { FormLayout } from 'ng-devui/form';
//import { environment } from 'src/environments/environment';
import { LANGUAGES } from 'src/config/language-config';

@Component({
  selector: 'da-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private destroy$: Subject<void> = new Subject();

  tabActiveId: string | number = 'tab1';
  showPassword = false;
  horizontalLayout: FormLayout = FormLayout.Horizontal;

  languages = LANGUAGES;
  language: string;
  waittingRt: any;
  tabItems: any;
  islogining=false;
  i18nValues: any;

  formData = {
    account: '',
    pwd: '',
  };

  formRules: { [key: string]: DValidateRules } = {
    usernameRules: {
      validators: [
        { required: true },
        { minlength: 2 },
        { maxlength: 20 },
        {
          pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
          message: '输入只包含数字或字母用户名',
        },
      ]
    },
    passwordRules: {
      validators: [{ required: true }, { minlength: 6 }, { maxlength: 16 }, { pattern: /^[a-zA-Z0-9\d@$!%*?&.]+(\s+[a-zA-Z0-9]+)*$/ }],
      message: '请输入6到16位的密码',
    },
  };

  @HostListener('window:keydown.enter')
  onEnter() {
    this.onClick(this.tabActiveId);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translate: TranslateService,
    private i18n: I18nService,
    private loadingService:LoadingService,
    private toastService:ToastService,
    private personalizeService: PersonalizeService
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.translate
      .get('loginPage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18nValues = this.translate.instant('loginPage');
        this.updateTabItems(res);
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: TranslationChangeEvent) => {
        this.i18nValues = this.translate.instant('loginPage');
        this.updateTabItems(this.i18nValues);
      });
    this.language = this.translate.currentLang;
    this.personalizeService.setRefTheme(ThemeType.Default);

    this.route.queryParams.pipe(
      map(param => param['code'])
    ).subscribe(code => {
      if(code && code.length > 0) {
        setTimeout(() => {
          this.showToast('success',this.i18nValues['callbackMessage']);
        });
      }
    });
  }
  showToast(type, msg) {
     this.toastService.open({
        value: [{ severity: type, summary: '提示', content: msg }],
    });
}
  onClick(tabId: string | number) {

    switch (tabId) {
      case 'tab1':
        if(this.islogining)return;
        this.islogining=true;

        this.waittingRt = this.loadingService.open();
        this.authService.login(this.formData.account, this.formData.pwd)
          .subscribe((res) => {
            this.islogining=false;
            this.waittingRt.loadingInstance.close();

              if(res.code===200){
                this.authService.setSession(res.value);
                this.router.navigate(['/']);
              }else{
                this.showToast('error',res.value);
              }
            },
            (error) => {
              this.islogining=false;
              console.log(error);
              this.waittingRt.loadingInstance.close();
              this.authService.logout();
              this.showToast('error',error.statusText);
            }
          );
        break;
      case 'tab2':
        break;
      default:
        break;
    }
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  updateTabItems(values: any) {
    this.tabItems = [
      {
        id: 'tab1',
        title: values['loginWays']['account']
      }
    ];
  }

  onKeyUp(e: KeyboardEvent, tabId: string | number) {
    if (e.key === 'Enter') {
      this.onClick(tabId);
    }
  }

  // handleAuth(type: string){
  //   console.log(type);
  //   const config = {
  //     oauth_uri: 'https://github.com/login/oauth/authorize',
  //     redirect_uri: 'https://devui.design/admin/login',
  //     client_id: 'ef3ce924fcf915c50910'
  //   };
  //   if (!environment.production) {
  //     config.redirect_uri = 'http://localhost:4200/login';
  //     config.client_id = 'ecf5e43d804e8e003196';
  //   }
  //   window.location.href = `${config.oauth_uri}?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}`
  // }
}
