export interface ListPager {
    total?: number,
    pageSize?: number;
    pageIndex?: number
}
export interface IService<T> {
    getSources(pager: ListPager,param:any,callback);
    update(item: T,callback);
    delete(item: T,callback);
}