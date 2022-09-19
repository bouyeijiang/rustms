import { Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { IService, ListPager } from "./iservice";
import { SysMenu } from "src/app/@core/data/sysmenu";
import { HRequest } from "./hrequest";

@Injectable()
export class SysMenuService implements IService<SysMenu> {
    constructor(private req: HRequest) {

    }
    getSources(pager: ListPager,param,callback) {

       return this.req.httpGet("pri/menu/get_list","",callback);
    }

    getMemnuByUserId(callback){
        let info_str=localStorage.getItem('userinfo');
        if (info_str===null){
            callback({  code:0, value:'用户信息已经过期,请重新登录'});
            return;
        }
        let info=JSON.parse(info_str);        
        return this.req.httpGet("pri/menu/get_menu_by_userid","user_id="+info.id,callback);
    }

    update(item: SysMenu,callback) {
        let param={
            id:item.id,
            act:'edit',
            menu_name:item.menu_name,
            menu_uri:item.menu_uri,
            menu_type:String(item.menu_type),
           icon:item.icon,
           pid:item.pid,
           mindex:String(item.mindex)
        };
        this.req.httpPost("pri/menu/add_or_update",param,callback);
    }

    add(item: SysMenu,callback) {
        let param={
            id:item.id,
            act:'add',
            menu_name:item.menu_name,
            menu_uri:item.menu_uri,
            menu_type:String(item.menu_type),
           icon:item.icon,
           pid:item.pid,
           mindex:String(item.mindex)
        };
        this.req.httpPost("pri/menu/add_or_update",param,callback);
    }

    delete(item: SysMenu,callback) {
        let urlparam='id='+item.id;

        this.req.httpGet("pri/menu/delete_by_id",urlparam,callback);
    }
}