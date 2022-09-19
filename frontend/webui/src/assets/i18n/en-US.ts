import pages from './en-US/page';
import start from './en-US/start';
import abnormal from './en-US/abnormal';
import personalize from './en-US/personalize';
import authGuard from './en-US/auth-guard';
import footer from './en-US/footer';
import header from './en-US/header';
import login from './en-US/login';

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
