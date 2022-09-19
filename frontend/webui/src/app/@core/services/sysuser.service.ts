import { Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { IService, ListPager } from "./iservice";
import { SysUser } from "src/app/@core/data/sysuser"
import { HRequest } from "./hrequest";

@Injectable()
export class SysUserService implements IService<SysUser> {
    constructor(private req: HRequest) {

    }
    getSources(pager: ListPager,param,callback) {
        let index = pager.pageIndex!;
        let size = pager.pageSize!;

        let urlparam='page='+index+'&size='+size+'&uname='+param.uname+'&phone='+param.phone;

       this.req.httpGet("pri/user/get_list", urlparam,callback);
    }

    update(item: SysUser,callback) {
        let param={
            id:item.id,
            act:'edit',
            uname:item.uname,
            phone:item.phone,
            realname:item.realname,
            upwd:item.upwd,
            status:String(item.status),
            sex:item.sex,
            utype:String(item.utype),
            dept_id:item.dept_id,
            menu_role_id:item.menu_role_id,
            data_role_id:item.data_role_id
        };
        this.req.httpPost("pri/user/add_or_update",param,callback);
    }

    add(item: SysUser,callback) {
        let param={
            id:item.id,
            act:'add',
            uname:item.uname,
            phone:item.phone,
            realname:item.realname,
            upwd:item.upwd,
            status:String(item.status),
            sex:item.sex,
            utype:String(item.utype),
            dept_id:item.dept_id,
            menu_role_id:item.menu_role_id,
            data_role_id:item.data_role_id
        };
        this.req.httpPost("pri/user/add_or_update",param,callback);
    }

    delete(item: SysUser,callback) {
        let urlparam='id='+item.id;

        this.req.httpGet("pri/user/delete_by_id",urlparam,callback);
    }
}