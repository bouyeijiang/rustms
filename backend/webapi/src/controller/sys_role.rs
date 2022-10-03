use std::collections::HashMap;

use crate::models::layer_role::LayerRole;
use actix_web::{get, post, web,Responder,HttpRequest};
use entities::*;

#[get("/pri/role/get_list")]
pub async fn get_role_list(req:HttpRequest,data: web::Query<HashMap<String, String>>) -> impl Responder {
    let list = LayerRole::get_list(&req,data).await;

    web::Json(list)
}

#[post("/pri/role/add_or_update")]
pub async fn add_update_role(data: web::Json<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();  
    let zore_def="0".to_owned(); 
    let act= data.get("act").unwrap_or(&def);
    let id = data.get("id").unwrap_or(&def);
    let role_name = data.get("role_name").unwrap_or(&def);
    let role_type:i16 = data.get("role_type").unwrap_or(&zore_def).parse().unwrap();
    let role_detail_json=data.get("detail").unwrap_or(&def);

    let result = LayerRole::add_or_update(act,id,role_name,role_type,role_detail_json).await;
 
    web::Json(result)
}

#[get("/pri/role/get_by_id")]
pub async fn get_role_byid(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();
    let id = data.get("id").unwrap_or(&def);

    if id.len()<32{
        return web::Json(DResult::success(SysRole::new()));
    }

    let usr = LayerRole::get_role_by(id).await;
    if usr.id.len()<=0{
       return web::Json(DResult::failure(usr));
    }

    web::Json(DResult::success(usr))
}

#[get("/pri/role/get_rigth_by_id")]
pub async fn get_rigth_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();
    let id = data.get("role_id").unwrap_or(&def);

    if id.len()<32{
        return web::Json(DResult::failure(vec![]));
    }
    let ls = LayerRole::get_right_by(id).await;

    web::Json(DResult::success(ls))
}

#[get("/pri/role/delete_by_id")]
pub async fn delete_role_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let id = data.get("id").unwrap_or(&def);

    if id.len()<=0{
        return web::Json(DResult::failure(String::from("编号为空")));
    }

    let rt = LayerRole::delete_by(id).await;
    web::Json(rt)
}