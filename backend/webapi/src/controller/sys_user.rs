use std::collections::HashMap;

use crate::models::layer_user::LayerUser;
use actix_web::{get, post, web,Responder,HttpRequest};
use entities::*;

#[get("/pri/user/get_list")]
pub async fn get_user_list(req:HttpRequest,data: web::Query<HashMap<String, String>>) -> impl Responder {

    //println!("{:?}",req.headers());

    let list = LayerUser::get_list(&req,data).await;

    web::Json(list)
}

#[get("/pri/user/get_portal_pie")]
pub async fn get_portal_pie()->impl Responder{

    let rt=LayerUser::get_portal_pie().await;

    web::Json(rt)
}

#[post("/pri/user/add_or_update")]
pub async fn add_update_user(data: web::Json<HashMap<String, String>>) -> impl Responder {

    let result = LayerUser::add_or_update(data).await;

    web::Json(result)
  }

#[get("/pri/user/get_by_id")]
pub async fn get_user_by_id(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();

    let uid = data.get("id").unwrap_or(&def);
    if uid.len()<32{
        return web::Json(DResult::failure(SysUser::new()));
    }

    let usr = LayerUser::get_by(uid).await;
    if usr.id.len()<=0{
       return web::Json(DResult::failure(usr));
    }

    web::Json(DResult::success(usr))
}

#[get("/pri/user/delete_by_id")]
pub async fn delete_user_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let id = data.get("id").unwrap_or(&def);

    if id.len()<=0{
        return web::Json(DResult::failure("编号为空"));
    }

    let is_ok = LayerUser::delete_by(id).await;
    if is_ok{
       return web::Json(DResult::success("删除成功"));
    }

    web::Json(DResult::failure("删除失败"))
}