use dblink::Dbcfg;
use dblink::pglink::*;
use entities::*;
use actix_web::{web};
use crate::utils::{webutil::*};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;
pub struct LayerRole{}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RightValue{
    pub id:String,
    pub value:String
}

impl LayerRole{

    pub async fn get_list(data: web::Query<HashMap<String, String>>)->PResult<Vec<SysRole>>{
        let mut cfg = Dbcfg::get_globalcfg();
        let def: String = "".to_owned();
        let role_name = data.get("role_name").unwrap_or(&def);

        let exist_str=format!("select count(*) from sys_role where role_name like '%{}%'",role_name);
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

            let command_text = format!("select cast(id as varchar) as id,role_name,role_type from sys_role where role_name like '%{}%' order by gentime desc limit {} offset {}",
            role_name,size,size*page);

            let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
            let list = SysRole::from_vec(rt);

           return PResult::success(list, _total);
        }

        let empty:Vec<SysRole>=Vec::new();

        PResult::failure(empty, String::from("无数据"))
    }

    //修改或更新
    pub async fn add_or_update(act:&str,id:&str,role_name:&str,role_type:i16,detail:&str)->DResult<String>{

        if role_name.len()==0{
            return DResult{code:0,value:String::from("角色名称不能为空")};
        }
        if detail.len()==0{
            return DResult{code:0,value:String::from("权限内容不能为空")};
        }

        let mut cfg = Dbcfg::get_globalcfg();

        if act == "edit" {
            if id.len()<=0{
                return DResult{code:0,value:String::from("编号不存在")};
            }
            
            let exist_str=format!("select count(*) from sys_role where id!='{1}' and role_name='{}')",id,role_name);
            let exist=PgLink::db_query_one(&mut cfg,&exist_str).await;
            
            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };

            if is_in{
                return DResult{code:1,value:String::from("角色名称已经存在")};
            }

            let rigth_str=LayerRole::right_command_text(act,id,detail);

            let command_text = format!(
                "update sys_role set role_name='{}',role_type='{}' where id='{}';{}",
                role_name,role_type,id,rigth_str
            );

            let rt = PgLink::db_batch_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult{code:0,value:String::from("修改失败")}
                }
                Ok(()) => {
                    DResult{code:200,value:String::from("修改成功")}
                }
            }
        }else{
            let exist_str=format!("select count(*) from sys_role where role_name='{}')",role_name);
            let exist= PgLink::db_query_one(&mut cfg,&exist_str).await;

            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };
            if is_in{
                return DResult{code:1,value:String::from("角色名称已经存在")};
            }

            let nid=Uuid::new_v4().to_string();
            let rigth_str=LayerRole::right_command_text(act,nid.as_str(),detail);

            let command_text = format!("insert into sys_role(id,role_name,role_type) values('{}','{}','{}');{}",
            nid,role_name,role_type,rigth_str);

            let rt = PgLink::db_batch_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult{code:1,value:String::from("添加失败")}
                }
                Ok(()) => {
                    DResult{code:200,value:String::from("添加成功")}    
                }
            }
        }
    }
 
    pub async fn get_by(id: &str) -> SysRole {
        let mut cfg = Dbcfg::get_globalcfg();
        let command_text = format!("select * from sys_role where id='{}'", id);

        let rt = PgLink::db_query_one(&mut cfg, &command_text).await;

        match rt {
            Err(e) => {
                println!("not found {}", e.to_string());
                SysRole::new()
            }
            Ok(r) => SysRole::from(r),
        }
    }

    pub async fn get_right_by(role_id:&str)->Vec<SysRight>{
        let mut cfg = Dbcfg::get_globalcfg();
        let command_text = format!("select cast(id as varchar) as id,cast(role_id as varchar) as role_id,
        cast(relate_id as varchar) as relate_id,right_value from sys_right where role_id='{}'", role_id);

        let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
        let list = SysRight::from_vec(rt);
        list
    }

    //删除
    pub async fn delete_by(id:&str)->DResult<String>{
        let mut cfg = Dbcfg::get_globalcfg();

        let mut command_text=format!("delete from sys_role where id='{}';",id);
        let right_str=format!("delete from sys_right where role_id='{}'",id);
        command_text.push_str(right_str.as_str());

        let rt=PgLink::db_batch_execute(&mut cfg, &command_text).await;
        let is_deleted= match rt {
            Ok(())=>{  true  },
            _=>false,
        };

        if is_deleted{
            DResult{
                code:200,
                value:String::from("删除成功")
            }
        }else{
            DResult{
                code:0,
                value:String::from("删除失败")
            }
        }
    }

    //权限表脚本拼接
    fn right_command_text(act:&str,role_id:&str,detail:&str)->String{
        let vals:Vec<RightValue>=serde_json::from_str(detail).unwrap();

        let mut command_text=String::from("");
        if act=="edit"{
            command_text=format!("delete from sys_right where role_id='{}';",role_id);
        }

        command_text.push_str("insert into sys_right(role_id,relate_id,right_value) values");

        for i in 0..vals.len(){
            let fmt=format!("('{}','{}','{}')",role_id,vals[i].id.as_str(),vals[i].value.as_str());
            command_text.push_str(fmt.as_str());
            if i<vals.len()-1{
                command_text.push(',');
            }
        }
        command_text
    }
}