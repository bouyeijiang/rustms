import { Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { IService, ListPager } from "./iservice";
import { HRequest } from "./hrequest";
import { SysRole } from "../data/sysrole";

@Injectable()
export class SysRoleService implements IService<SysRole> {
    constructor(private req: HRequest) {

    }
    getSources(pager: ListPager,param,callback) {
        let index = pager.pageIndex!;
        let size = pager.pageSize!;

        let urlparam='page='+index+'&size='+size+'&role_name='+param.role_name;

       return this.req.httpGet("pri/role/get_list", urlparam,callback);
    }

    getRight(role_id,callback){
        return this.req.httpGet("pri/role/get_rigth_by_id", "role_id="+role_id,callback);
    }

    update(item: SysRole,callback) {
        let param={
            id:item.id,
            act:'edit',
            role_name:item.role_name,
            role_type:String(item.role_type),
            detail:item.detail
        };
        this.req.httpPost("pri/role/add_or_update",param,callback);
    }

    add(item: SysRole,callback) {
        let param={
            id:item.id,
            act:'add',
            role_name:item.role_name,
            role_type:String(item.role_type),
            detail:item.detail
        };
        this.req.httpPost("pri/role/add_or_update",param,callback);
    }

    delete(item: SysRole,callback) {
        let urlparam='id='+item.id;

        this.req.httpGet("pri/role/delete_by_id",urlparam,callback);
    }
}