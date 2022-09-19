use std::collections::HashMap;
use crate::models::layer_dept::LayerDept;
use actix_web::{get, post, web,Responder};
use entities::*;

#[get("/pri/dept/get_list")]
pub async fn get_dept_list(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let list = LayerDept::get_list(data).await;

    web::Json(list)
}

#[get("/pri/dept/get_list_tree")]
pub async fn get_list_tree()->impl Responder{
    let list = LayerDept::get_list_tree().await;
    web::Json(list)
}

#[get("/pri/dept/get_list_by_parent")]
pub async fn get_dept_list_byparent(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="00000000-0000-0000-0000-000000000000".to_owned();
    let parentid = data.get("pid").unwrap_or(&def);

    let result = LayerDept::get_list_by_parent(parentid).await;
    web::Json(result)
}

#[post("/pri/dept/add_or_update")]
pub async fn add_update_dept(data: web::Json<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();  
    let act= data.get("act").unwrap_or(&def);
    let id = data.get("id").unwrap_or(&def);
    let dept = data.get("dept").unwrap_or(&def);
    let dindex:i32=data.get("dindex").unwrap_or(&def).parse().unwrap_or(0);
    let parentid = data.get("pid").unwrap_or(&def);

    let result = LayerDept::add_or_update(act,id,dept,parentid,dindex).await;
 
    web::Json(result)
}

#[get("/pri/dept/get_by_id")]
pub async fn get_dept_byid(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();
    let id = data.get("id").unwrap_or(&def);

    if id.len()<32{
        return web::Json(DResult{
            value:SysDept::new(""),
            code:0
        });
    }

    let usr = LayerDept::get_by(id).await;
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

#[get("/pri/dept/delete_by_id")]
pub async fn delete_dept_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let id = data.get("id").unwrap_or(&def);

    if id.len()<=0{
        return web::Json(DResult {
            value:String::from("编号为空"),
            code: 0,
        });
    }

    let rt = LayerDept::delete_by(id).await;
    web::Json(rt)
}