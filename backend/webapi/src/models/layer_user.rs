use crate::jwttoken::*;
use dblink::{Dbcfg,Settings,pglink::*};
use entities::*;
use actix_web::{web,HttpRequest};
use crate::utils::{webutil::*,cryptutil::*};
use std::collections::HashMap;

use SysUser;

pub struct LayerUser{}

pub struct DefError {
    pub code: i16,
    pub msg: String,
}

impl LayerUser {
    //获取用户列表
    pub async fn get_list(req:&HttpRequest,data: web::Query<HashMap<String, String>>) -> PResult<Vec<SysUser>> {
        let token=WebUtil::get_token_from_header(req);
        if token.1==false{
            let empty:Vec<SysUser>=Vec::new();
            return PResult::unauthorized(empty, String::from("登录验证失效"));
        }

        let def: String = "".to_owned();
        let uname = data.get("uname").unwrap_or(&def);
        let phone = data.get("phone").unwrap_or(&def);
        let claims=token.0;

        let mut wherestr=String::from("where 1=1");
        //管理员具备所有权限
        if claims.id!="00000000-0000-0000-0000-000000000000"{
           wherestr= format!(" where dept_id in(select relate_id from sys_right where role_id='{}' group by relate_id)",claims.data_role_id);
        }

        if uname.len() > 0 || phone.len()>0{
            let s = format!(" and (uname like '{}%' or phone like '{}%')", uname,phone);
            wherestr.push_str(&s);
        }
        let mut cfg = Dbcfg::get_globalcfg();

        let mut exe_cmd_text=format!("select count(*) from sys_user {}",wherestr);
        let cnt_rt=PgLink::db_query_one(&mut cfg, &mut exe_cmd_text).await;
        let _total= match cnt_rt {
            Ok(rt)=>{
                let v:i64=rt.get(0);
                v
            },
            _=>0,
        };
 
        if _total==0{
            let empty:Vec<SysUser>=Vec::new();
            return PResult::failure(empty, String::from("无数据"));
        }

        let p = WebUtil::get_page_from_query(&data);

        let page = p.0;
        let size = p.1;

        let mut command_text = format!(
            "select 
            cast(su.id as varchar) as id,uname,realname,sex,phone,utype,status,cast(dept_id as varchar) as dept_id,
            cast(menu_role_id as varchar) as menu_role_id,cast(data_role_id as varchar) as data_role_id,to_char(su.gentime,'yyyy-MM-dd HH:mm:ss') as gentime,
            sd.dept from
            (select * from sys_user {}) su
            left join
            sys_dept sd
            on su.dept_id =sd.id 
            order by gentime desc offset {} limit {}",
            wherestr,page * size, size);
 
        let rt = PgLink::db_query(&mut cfg, &mut command_text).await.unwrap();
        let list = SysUser::from_vec(rt);

        return PResult::success(list, _total);
    }
  
    pub async fn get_portal_pie()->DResult<Vec<DtoPortalPie>>{
        let mut cfg = Dbcfg::get_globalcfg();
        
        let mut command_text = String::from("select ym,cast(sum(total)as int) as total,");
           command_text.push_str("cast(sum(case when utype=0 then total else 0 end) as int) as b_total, ");
           command_text.push_str("cast(sum(case when utype=1 then total else 0 end) as int) as c_total ");
           command_text.push_str("from(");
           command_text.push_str("select utype,to_char(gentime,'yyyy-MM') as ym,count(*) as total from  sys_user");
           command_text.push_str(" GROUP BY utype,to_char(gentime,'yyyy-MM')");
           command_text.push_str(")t group by ym");
           command_text.push_str(" order by ym desc limit 6");

        let rt = PgLink::db_query(&mut cfg, &mut command_text).await.unwrap();
        let list = DtoPortalPie::from_vec(rt);
        DResult::success(list)
    }

    //用户登录
    pub async fn sys_user_login(usr: &str, pwd: &str) -> Result<TokenResult, DefError> {
        let mut cfg = Dbcfg::get_globalcfg();
        let _pwd=CryptoUtil::to_md5(pwd).to_uppercase();

        let mut command_text = format!("select cast(id as varchar) as id,uname,phone,cast(dept_id as varchar) as dept_id,
        cast(menu_role_id as varchar) as menu_role_id,cast(data_role_id as varchar) as data_role_id from sys_user 
        where utype=1 and (uname='{0}' or phone='{0}') and upwd='{1}'",usr,_pwd);
        let row = PgLink::db_query_one(&mut cfg, &mut command_text).await;

        match row {
            Err(e) =>{ 
                let mut _err= e.to_string();
                 if _err.ends_with("number of rows"){
                    _err=String::from("用户名或密码错误");
                 }

                Err(DefError {
                code: -1,
                msg:_err.to_owned()})
             },Ok(item) => {
                let _item = SysUser::from(item);
                let uname: String = _item.uname.clone();
                let id: String = _item.id.clone();
             
                let mut token_claims = Claims::new(&id, &uname,&_item.data_role_id,&_item.dept_id);

                //println!("{:?}",token_claims);

                let setting=Settings::get_globalcfg();

                let token = token_claims.create_token(setting.expired);
                Ok(TokenResult{
                    token:token,
                    expired:setting.expired,
                    user_info:_item
                })
            }
        }
    }

    //修改或更新
    pub async fn add_or_update(data: web::Json<HashMap<String, String>>) -> DResult<String> {
        let def: String = "".to_owned();
        let zore_def="0".to_owned();
        let guid_def="00000000-0000-0000-0000-000000000000".to_owned();

        let act = data.get("act").unwrap_or(&def);
        let uname = data.get("uname").unwrap_or(&def);
        let mut phone=data.get("phone").unwrap_or(&def);
        let upwd = data.get("upwd").unwrap_or(&def);
        let status = data.get("status").unwrap_or(&zore_def);
        let sex = data.get("sex").unwrap_or(&def);
        let realname = data.get("realname").unwrap_or(&def);
        let dept_id = data.get("dept_id").unwrap_or(&guid_def);
        let utype=data.get("utype").unwrap_or(&zore_def);

        let menu_role_id = data.get("menu_role_id").unwrap_or(&guid_def);
        let data_role_id = data.get("data_role_id").unwrap_or(&guid_def);

        let _pwd=  CryptoUtil::to_md5(&upwd).to_uppercase();

        if uname.len()==0{
            return DResult::failure(String::from("账户不能为空"));
        }else if dept_id.len()==0{
            return DResult::failure( String::from("部门不能为空"));
        }

        if phone.len()==0{
            phone=uname;
        }

        let mut cfg = Dbcfg::get_globalcfg();

        if act == "edit" {
            let id=data.get("id").unwrap_or(&def);
            if id.len()<=0{
                return DResult::failure(String::from("编号不能为空"));
            }
            
            let exist_str=format!("select count(*) from sys_user where utype='{}' and id!='{}' and (uname='{}' or phone='{}')",utype,id,uname,phone);
            let exist=PgLink::db_query_one(&mut cfg,&exist_str).await;
            
            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };

            if is_in{
                return DResult::failure(String::from("该账户或手机号已经存在"));
            }

            let command_text = format!(
                "update sys_user set uname='{}',realname='{}',phone='{}',upwd='{}',status={},sex='{}',utype={},
                dept_id='{}',menu_role_id='{}',data_role_id='{}' where id='{}'",
                uname,realname, phone, _pwd, status,sex,utype,dept_id,menu_role_id,data_role_id,id
            );

            let rt = PgLink::db_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult::error(String::from("修改异常"))
                }
                Ok(rt) => {
                    if rt > 0 {  DResult::success(String::from("修改成功"))
                    } else {
                      DResult::failure(String::from("修改失败"))
                    }
                }
            }
        }else{
            let exist_str=format!("select count(*) from sys_user where utype='{}' and (uname='{}' or phone='{}')",utype,uname,phone);
            let exist= PgLink::db_query_one(&mut cfg,&exist_str).await;

            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };
            if is_in{
               return DResult::failure(String::from("该账户或手机号已经存在"));
            }

            let command_text = format!(
                "insert into sys_user(uname,realname,phone,upwd,status,utype,sex,dept_id,menu_role_id,data_role_id)
                 values('{}','{}','{}','{}',{},{},'{}','{}','{}','{}')",
                uname,realname, phone, _pwd, status,utype,sex,dept_id,menu_role_id,data_role_id
            );
            let rt = PgLink::db_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult::error(String::from("添加异常"))
                },
                Ok(rt) => {
                    if rt > 0 {
                           DResult::success(String::from("添加成功"))
                        }else {
                          DResult::failure(String::from("添加失败"))
                    }
                }
            }
        }
    }

    pub async fn get_by(uid: &str) -> SysUser {
        let mut cfg = Dbcfg::get_globalcfg();
        let command_text = format!("select * from sys_user where id='{}'", uid);

        let rt = PgLink::db_query_one(&mut cfg, &command_text).await;

        match rt {
            Err(e) => {
                println!("not found {}", e.to_string());
                SysUser::new()
            }
            Ok(r) => SysUser::from(r),
        }
    }

    pub async fn delete_by(uid:&str)->bool{
        let command_text = format!("delete from sys_user where id='{}'", uid);
 
        let mut cfg = Dbcfg::get_globalcfg();
        let rt = PgLink::db_execute(&mut cfg, &command_text).await;

        match rt {
            Err(e) => {
                println!("error {}", e.to_string());
                false
            }
            Ok(r) =>{
                r>0
            },
        }
    }
}
