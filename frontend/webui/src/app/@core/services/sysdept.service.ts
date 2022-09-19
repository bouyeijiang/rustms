import { Observable, of as observableOf } from "rxjs";
import { Injectable } from "@angular/core";
import { IService, ListPager } from "./iservice";
import { SysDept } from "src/app/@core/data/sysdept";
import { HRequest } from "./hrequest";

@Injectable()
export class SysDeptService implements IService<SysDept> {
    constructor(private req: HRequest) {

    }
    getSources(pager: ListPager,param,callback) {
        let index = pager.pageIndex!;
        let size = pager.pageSize!;

        let urlparam='page='+index+'&size='+size+'&dept='+param.dept;

        this.req.httpGet("pri/dept/get_list", urlparam,callback);
    }

    getDeptTree(callback){
        this.req.httpGet("pri/dept/get_list_tree", "",callback);
    }

    update(item: SysDept,callback) {
        let param={
            id:item.id,
            act:'edit',
            dept:item.dept,
            pid:item.pid,
            dindex:String(item.dindex)
        };
        this.req.httpPost("pri/dept/add_or_update",param,callback);
    }

    add(item: SysDept,callback) {
        let param={
            id:item.id,
            act:'add',
            dept:item.dept,
            pid:item.pid,
            dindex:String(item.dindex)
        };
        this.req.httpPost("pri/dept/add_or_update",param,callback);
    }

    delete(item: SysDept,callback) {
        let urlparam='id='+item.id;

        this.req.httpGet("pri/dept/delete_by_id",urlparam,callback);
    }
}