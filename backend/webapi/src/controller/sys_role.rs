use std::collections::HashMap;

use crate::models::layer_role::LayerRole;
use actix_web::{get, post, web,Responder};
use entities::*;

#[get("/pri/role/get_list")]
pub async fn get_role_list(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let list = LayerRole::get_list(data).await;

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
        return web::Json(DResult{
            value:SysRole::new(),
            code:0
        });
    }

    let usr = LayerRole::get_by(id).await;
    if usr.id.len()<=0{
       return web::Json(DResult {
            value: usr,
            code: 0,
        });
    }

    web::Json(DResult {
        value: usr,
        code: 200,
    })
}

#[get("/pri/role/get_rigth_by_id")]
pub async fn get_rigth_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();
    let id = data.get("role_id").unwrap_or(&def);

    if id.len()<32{
        return web::Json(DResult{
            value:vec![],
            code:0
        });
    }
    let ls = LayerRole::get_right_by(id).await;
    web::Json(DResult {
        value: ls,
        code: 200,
    })
}

#[get("/pri/role/delete_by_id")]
pub async fn delete_role_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let id = data.get("id").unwrap_or(&def);

    if id.len()<=0{
        return web::Json(DResult {
            value:String::from("编号为空"),
            code: 0,
        });
    }

    let rt = LayerRole::delete_by(id).await;
    web::Json(rt)
}