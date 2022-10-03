use dblink::Dbcfg;
use dblink::pglink::*;
use entities::*;
use crate::utils::{webutil::*};
use actix_web::{web,HttpRequest};
use std::collections::HashMap;


pub struct LayerDept{}
impl LayerDept{

    pub async fn get_list(req:&HttpRequest,data: web::Query<HashMap<String, String>>)->PResult<Vec<SysDept>>{
        let mut cfg = Dbcfg::get_globalcfg();

        let token=WebUtil::get_token_from_header(req);
        if token.1==false{
            let empty:Vec<SysDept>=Vec::new();
            return PResult::unauthorized(empty, String::from("登录验证失效"));
        }

        let claims=token.0;
        let mut wherestr=String::from("where 1=1");
        //管理员具备所有权限
        if claims.id!="00000000-0000-0000-0000-000000000000"{
           wherestr= format!(" where id in(select relate_id from sys_right where role_id='{}' group by relate_id)",claims.data_role_id);
        }
        let exist_str=format!("select count(*) from sys_dept {}",wherestr);
        let exist=PgLink::db_query_one(&mut cfg,&exist_str).await;
        let _total= match exist {
            Ok(rt)=>{
                let v:i64=rt.get(0);
                v
            },
            _=>0,
        };
        if _total>0{
            let p = WebUtil::get_page_from_query(&data);
            let page = p.0;
            let size = p.1;
            
            let command_text = format!("select cast(id as varchar) as id,dept,cast(pid as varchar) as pid,dindex from sys_dept {} order by gentime,dindex desc limit {} offset {}",
            wherestr,size,size*page);

            let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
            let list = SysDept::from_vec(rt);

           return PResult::success(list, _total);
        }

        let empty:Vec<SysDept>=Vec::new();

        PResult::failure(empty, String::from("无数据"))
    }

    pub async fn get_list_by_parent(req:&HttpRequest,parentid:&str)->Vec<SysDept>{
        let token=WebUtil::get_token_from_header(req);
        if token.1==false{
             println!("{:?}",token.0);
            return Vec::new();
        }

        let claims=token.0;
        let mut wherestr=String::from("1=1");
        //管理员具备所有权限
        if claims.id!="00000000-0000-0000-0000-000000000000"{
           wherestr= format!("cte.id in(select relate_id from sys_right where role_id='{}')",claims.data_role_id);
        }

        let command_text=format!("with recursive cte as (
            select id,dept,pid from sys_dept where dept='{}'
            union all 
            select org.id,org.dept,org.pid from sys_dept org,cte where org.pid =cte.id and {}
            )select cast(id as varchar) as id,dept,cast(pid as varchar) as pid from cte",parentid,wherestr);

            let mut cfg = Dbcfg::get_globalcfg();

            let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
            let list = SysDept::from_vec(rt);

            list
    }

    pub async fn get_list_tree(req:&HttpRequest)->DResult<TreeNodeDept>{
        let mut cfg = Dbcfg::get_globalcfg();
 
        let token=WebUtil::get_token_from_header(req);
        if token.1==false{
             println!("{:?}",token.0);
            return DResult::empty(TreeNodeDept::new(SysDept::new("总部")));
        }

        let claims=token.0;
        let mut wherestr=String::from("1=1");
        //管理员具备所有权限
        if claims.id!="00000000-0000-0000-0000-000000000000"{
           wherestr= format!("cte.id in(select relate_id from sys_right where role_id='{}')",claims.data_role_id);
        }

        let command_text = format!("with recursive cte as (
            select * from sys_dept where pid='00000000-0000-0000-0000-000000000000'
            union all 
            select dt.* from sys_dept dt,cte where dt.pid =cte.id and {}
            )select cast(id as varchar) as id,dept,cast(pid as varchar) as pid,dindex from cte order by dindex",wherestr);

        let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
        let list = SysDept::from_vec(rt);
 
        if list.len()==0{
            return DResult::empty(TreeNodeDept::new(SysDept::new("总部")));
        }

        let root=list.get(0).unwrap();

        let mut tree= Some(Box::new(TreeNodeDept::new(root.clone())));
        TreeNodeDept::from_vec(&mut tree,&list);
       
        let r=*tree.unwrap();
        DResult::success(r)
    }

    //修改或更新部门
    pub async fn add_or_update(act:&str,id:&str,dept:&str,pid:&str,dindex:i32)->DResult<String>{
        let mut cfg = Dbcfg::get_globalcfg();

        if act == "edit" {
            if id.len()<=0{
                return DResult::empty(String::from("编号不存在"));
            }
            
            let exist_str=format!("select count(*) from sys_dept where id!='{1}' and dept='{}')",id,dept);
            let exist=PgLink::db_query_one(&mut cfg,&exist_str).await;
            
            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };

            if is_in{
                return DResult::failure(String::from("部门名称已经存在"));
            }

            let command_text = format!(
                "update sys_dept set dept='{}',pid='{}',dindex={} where id='{}'",
                dept,pid,dindex,id
            );

            let rt = PgLink::db_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult::failure(String::from("修改失败"))
                }
                Ok(rt) => {
                    if rt > 0 {
                          DResult::success(String::from("修改成功"))
                    }
                     else {
                         DResult::failure(String::from("修改失败"))
                    }
                }
            }
        }else{
            let exist_str=format!("select count(*) from sys_dept where dept='{}')",dept);
            let exist= PgLink::db_query_one(&mut cfg,&exist_str).await;

            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };
            if is_in{
                return DResult::failure(String::from("部门名称已经存在"));
            }

            let command_text = format!("insert into sys_dept(dept,pid,dindex) values('{}','{}',{})",dept,pid,dindex);
            let rt = PgLink::db_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult::failure(String::from("添加失败"))
                }
                Ok(rt) => {
                    if rt > 0 {
                         DResult::success(String::from("添加成功"))
                    }
                     else {
                         DResult::failure(String::from("添加失败"))
                    }
                }
            }
        }
    }
 
    //根据编号获取项
    pub async fn get_by(id: &str) -> SysDept {
        let mut cfg = Dbcfg::get_globalcfg();
        let command_text = format!("select * from sys_dept where id='{}'", id);

        let rt = PgLink::db_query_one(&mut cfg, &command_text).await;

        match rt {
            Err(e) => {
                println!("not found {}", e.to_string());
                SysDept::new("")
            }
            Ok(r) => SysDept::from(r),
        }
    }
   
    //删除
    pub async fn delete_by(id:&str)->DResult<String>{
        let mut cfg = Dbcfg::get_globalcfg();

        let command_text=format!("delete from sys_dept where id='{}'",id);
        let rt=PgLink::db_execute(&mut cfg, &command_text).await;
        let is_deleted= match rt {
            Ok(rt)=>{
                if rt>0{ true}else{  false }
            },
            _=>false,
        };

        if is_deleted{
            DResult::success(String::from("删除成功"))
        }else{
            DResult::failure(String::from("删除失败"))
        }
    }
}