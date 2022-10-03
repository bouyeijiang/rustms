use dblink::Dbcfg;
use dblink::pglink::*;
use entities::*;

pub struct LayerMenu{}

impl LayerMenu{

    pub async fn get_list()->DResult<TreeNodeMenu>{
        let mut cfg = Dbcfg::get_globalcfg();
 
        let command_text = format!("with recursive cte as (
            select * from sys_menu where pid='00000000-0000-0000-0000-000000000000'
            union all 
            select menu.* from sys_menu menu,cte where menu.pid =cte.id
            )select cast(id as varchar) as id,menu_name,menu_uri,menu_type,cast(pid as varchar) as pid,icon,mindex from cte order by mindex");

        let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
        let list = SysMenu::from_vec(rt);
 
        if list.len()==0{
            return DResult::failure(TreeNodeMenu::new(SysMenu::new("系统菜单")));
        }

        let root=list.get(0).unwrap();
        

        let mut tree= Some(Box::new(TreeNodeMenu::new(root.clone())));
        TreeNodeMenu::from_vec(&mut tree,&list);
       
        let r=*tree.unwrap();
        DResult::success(r)
    }
    //修改或更新部门
    pub async fn add_or_update(act:&str,id:&str,menu_name:&str,menu_uri:&str,icon:&str,menu_type:i16,pid:&str)->DResult<String>{
        let mut cfg = Dbcfg::get_globalcfg();

        if act == "edit" {
            if id.len()<=0{
                return DResult::empty(String::from("编号不存在"));
            }
            
            let exist_str=format!("select count(*) from sys_menu where id!='{}' and menu_name='{}')",id,menu_name);
            let exist=PgLink::db_query_one(&mut cfg,&exist_str).await;
            
            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };

            if is_in{
                return DResult::failure(String::from("菜单名称已经存在"));
            }

            let command_text = format!(
                "update sys_menu set menu_name='{}',menu_uri='{}',pid='{}',menu_type={},icon='{}' where id='{}'",
                menu_name,menu_uri,pid,menu_type,icon,id
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
                    }else {
                         DResult::failure(String::from("修改失败"))
                    }
                }
            }
        }else{
            let exist_str=format!("select count(*) from sys_menu where menu_name='{}')",menu_name);
            let exist= PgLink::db_query_one(&mut cfg,&exist_str).await;

            let is_in= match exist {
                Ok(rt)=>{
                    let v:i64=rt.get(0);
                    if v>0{ true}else{  false }
                },
                _=>false,
            };
            if is_in{
                return DResult::failure(String::from("菜单名称已经存在"));
            }

            let command_text = format!("insert into sys_menu(menu_name,menu_uri,pid,menu_type,icon)
             values('{}','{}','{}',{},'{}')",menu_name,menu_uri,pid,menu_type,icon);
            let rt = PgLink::db_execute(&mut cfg, &command_text).await;
            match rt {
                Err(e) => {
                    println!("add failed {}", e.to_string());
                    DResult::failure(String::from("添加失败"))
                }
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
 
    pub async fn get_by(id: &str) -> SysDept {
        let mut cfg = Dbcfg::get_globalcfg();
        let command_text = format!("select * from sys_menu where id='{}'", id);

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

        let command_text=format!("delete from sys_menu where id='{}'",id);
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
    //用户菜单角色过滤
    pub async fn get_list_by_userid(user_id:&str)->DResult<TreeNodeMenu>{
        let mut cfg = Dbcfg::get_globalcfg();

        let mut where_str=String::from("");
    
        if !user_id.eq_ignore_ascii_case("00000000-0000-0000-0000-000000000000"){
           where_str= format!("where menu_type =0 or (menu_type =1 and id in (select relate_id from sys_right where role_id in(
            select menu_role_id from sys_user where id='{}')))",user_id);
        }

        let command_text = format!("with recursive cte as (
            select * from sys_menu where pid='00000000-0000-0000-0000-000000000000'
            union all 
            select menu.* from sys_menu menu,cte where menu.pid =cte.id
            )select cast(id as varchar) as id,menu_name,menu_uri,menu_type,cast(pid as varchar) as pid,icon,mindex
            from cte {} order by mindex",where_str);

       //println!("{}",command_text);

        let rt = PgLink::db_query(&mut cfg, &command_text).await.unwrap();
        let list = SysMenu::from_vec(rt);
 
        if list.len()==0{
            return DResult::empty(TreeNodeMenu::new(SysMenu::new("系统菜单")))
        }

        let root=list.get(0).unwrap();
        
        let mut tree= Some(Box::new(TreeNodeMenu::new(root.clone())));
        TreeNodeMenu::from_vec(&mut tree,&list);
       
        let r=*tree.unwrap();
        DResult::success(r)
    }
}