use crate::controller::{
    sys_auth::*,sys_user::*,
    sys_dept::*,sys_menu::*,sys_role::*
};
use entities::*;

use actix_files as fs;
use actix_web::{web,get,Result,Responder,HttpRequest,HttpResponse,http::header,Either,guard};
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

        .service(fs::Files::new("/statics", "resources/statics/").show_files_listing())
        .service(fs::Files::new("/assets", "resources/pages/assets/").show_files_listing())
        .service(fs::Files::new("/", "resources/pages/").prefer_utf8(true))
        .default_service(web::route().guard(guard::Get()).guard(guard::Post()).to(not_found));
}

//配置静态页面的默认首页
#[get("/")]
pub async fn index()->Result<NamedFile>{
    let path=PathBuf::from("resources/pages/index.html");
    Ok(NamedFile::open(path)?)
}

pub async fn not_found(req:HttpRequest)->Either<NamedFile,impl Responder>{
    let def = header::HeaderValue::from_str("").unwrap();
    let content_type=req.headers().get("content-type").unwrap_or(&def).to_str().ok();
    
    match content_type{
        Some(val)=>{

            if val.eq_ignore_ascii_case("application/json") ||
            val.eq_ignore_ascii_case("multipart/form-data"){
               Either::Right(HttpResponse::NotFound()
                .content_type("application/json")
                .json(DResult::not_found("Not found method")))
            }else{
                let path = "resources/pages/index.html";
                let fs=NamedFile::open(path);
                match fs{
                    Ok(val)=>{
                        Either::Left(val)
                    },_error=>{
                       Either::Right(HttpResponse::NotFound().body("Not found request page"))
                    }
                }
               
               //HttpResponse::NotFound().body("Not found request page")
            }
        },
        _=>{
           Either::Right(HttpResponse::BadGateway().body("An error occurred"))
        }
    } 
}