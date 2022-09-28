use crate::controller::{
    sys_auth::*,sys_user::*,
    sys_dept::*,sys_menu::*,sys_role::*
};

use actix_files as fs;
use actix_web::{web,get,Result};
use actix_files::NamedFile;
use std::path::PathBuf;

//配置接口地址路由方法
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(do_login)
        .service(get_user_list)
        .service(add_update_user)
        .service(delete_user_byid)
        .service(get_user_by_id)
        .service(get_portal_pie)

        .service(get_dept_list)
        .service(add_update_dept)
        .service(delete_dept_byid)
        .service(get_dept_byid)

        .service(get_dept_list)
        .service(add_update_dept)
        .service(delete_dept_byid)
        .service(get_dept_byid)
        .service(get_list_tree)

        .service(get_menu_list)
        .service(add_update_menu)
        .service(delete_menu_byid)
        .service(get_menu_byid)
        .service(get_menu_by_userid)

        .service(get_role_list)
        .service(add_update_role)
        .service(delete_role_byid)
        .service(get_rigth_byid)
        .service(get_role_byid)
        .service(index)

        .service(fs::Files::new("/statics", "resources/statics/").prefer_utf8(true))
        .service(fs::Files::new("/assets", "resources/pages/assets/").prefer_utf8(true))
        .service(fs::Files::new("/", "resources/pages/").prefer_utf8(true));
}

//配置静态页面的默认首页
#[get("/")]
pub async fn index()->Result<NamedFile>{
    let path=PathBuf::from("resources/pages/index.html");
    Ok(NamedFile::open(path)?)
}