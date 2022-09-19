import {hex_sha1} from '@sha1/sha1.js';
import { Injectable } from '@angular/core';
import { throwError, of, Observable } from 'rxjs';
import { HttpParam } from 'src/config/setting';
import { HRequest } from './hrequest';


@Injectable()
export class AuthService {
  constructor(public req:HRequest) {}

  login(account: string, password: string):Observable<any> {

    let sha1_pwd=hex_sha1(password).toUpperCase();

   return this.req.httpPostWaiting("pub/auth/do_login",{
      uname:account,
      upwd:sha1_pwd
    });
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('userinfo');
  }

  setSession(resultJson) {
    let rt= JSON.parse(resultJson);
    HttpParam.httpOptions.Token.Value=rt.token;
    localStorage.setItem('id_token',rt.token);
    localStorage.setItem('userinfo', JSON.stringify(rt.user_info));
    localStorage.setItem('expires_at', rt.expired);
    localStorage.setItem('token_date', new Date().toLocaleDateString());
  }

  isUserLoggedIn() {
    if (localStorage.getItem('userinfo')) {
      let token=localStorage.getItem('id_token');
      HttpParam.httpOptions.Token.Value=token;

      return true;
    } else {
      return false;
    }
  }

  getSession(){
    let info=localStorage.getItem('userinfo');
    if (info) {
      return JSON.parse(info);
    } else {
      return null;
    }
  }
}
