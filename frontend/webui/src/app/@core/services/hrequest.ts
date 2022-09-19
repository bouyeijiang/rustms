import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpParam } from "src/config/setting";
import { AuthService } from "./auth.service";

@Injectable()
export class HRequest {
    constructor(private http: HttpClient,  private route: Router) {

     }

    httpPost(method, data, callbakfun) {
      let  httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': HttpParam.httpOptions.Token.ContentType,
                Authorization: HttpParam.httpOptions.Token.Value
            })
        };

       return this.http.post(HttpParam.url + method, data, httpOptions)
            .subscribe((result: any) => {
                if(result.code===401){
                    this.clearSession();
                    this.route.navigate(['/', 'login']);
                    return;
                }

                callbakfun(result);
            }, error => {
                console.log(error);
                if(error.status===401){
                    this.clearSession();
                    this.route.navigate(['/', 'login']);
                    return;
                }

                callbakfun({
                    code: 500,
                    value:'发生错误:'+error.statusText
                })
            })
    }

    httpPostWaiting(method,data){
        let  httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': HttpParam.httpOptions.Token.ContentType,
                Authorization: HttpParam.httpOptions.Token.Value
            })
        };

        return this.http.post(HttpParam.url + method, data, httpOptions)
    }

    httpGet(method, param, callbakfun) {
        let uri = HttpParam.url + method;

        if (param != null && param.length > 0) {
            uri = uri + "?" + param;
        }

        let  httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': HttpParam.httpOptions.Token.ContentType,
                Authorization: HttpParam.httpOptions.Token.Value
            })
        };

       return this.http.get(uri, httpOptions)
            .subscribe((result:any) => {

                if(result.code===401){
                    this.clearSession();
                    this.route.navigate(['/', 'login']);
                    return;
                }
                callbakfun(result);
            }, error => {
                console.log(error);

                if(error.status===401){
                    this.clearSession();
                    this.route.navigate(['/', 'login']);
                    return;
                }

                callbakfun({
                    code: 500,
                    value: '发生错误:'+error.statusText
                })
            })
    }

    httpGetWaiting(method,param){
        let uri =HttpParam.url + method;

        if (param != null && param.length > 0) {
            uri = uri + "?" + param;
        }

        let  httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': HttpParam.httpOptions.Token.ContentType,
                Authorization: HttpParam.httpOptions.Token.Value
            })
        };

       return this.http.get(uri, httpOptions)
    }

    clearSession() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('userinfo');
      }
}