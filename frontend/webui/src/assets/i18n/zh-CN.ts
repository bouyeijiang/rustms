import pages from './zh-CN/page';
import start from './zh-CN/start';
import abnormal from './zh-CN/abnormal';
import personalize from './zh-CN/personalize';
import authGuard from './zh-CN/auth-guard';
import footer from './zh-CN/footer';
import header from './zh-CN/header';
import login from './zh-CN/login';

export default {
  ...pages,
  ...start,
  ...personalize,
  ...authGuard,
  ...footer,
  ...header,
  ...login,
  ...abnormal
};
