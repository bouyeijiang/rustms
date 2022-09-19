use std::collections::HashMap;

use crate::models::layer_menu::LayerMenu;
use actix_web::{get, post, web,Responder};
use entities::*;

#[get("/pri/menu/get_list")]
pub async fn get_menu_list() -> impl Responder {
    let list = LayerMenu::get_list().await;

    web::Json(list)
}

#[post("/pri/menu/add_or_update")]
pub async fn add_update_menu(data: web::Json<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();  
    let zore_def="0".to_owned();

    let act= data.get("act").unwrap_or(&def);
    let id = data.get("id").unwrap_or(&def);
    let menu_name = data.get("menu_name").unwrap_or(&def);
    let menu_uri = data.get("menu_uri").unwrap_or(&def);
    let icon = data.get("icon").unwrap_or(&def);
    let pid = data.get("pid").unwrap_or(&def);
    let menu_type=data.get("menu_type").unwrap_or(&zore_def).parse().unwrap();

    let result = LayerMenu::add_or_update(act,id,menu_name,menu_uri,icon,menu_type,pid).await;
 
    web::Json(result)
}

#[get("/pri/menu/get_by_id")]
pub async fn get_menu_byid(data: web::Query<HashMap<String, String>>) -> impl Responder {
    let def="".to_owned();
    let id = data.get("id").unwrap_or(&def);

    if id.len()<32{
        return web::Json(DResult{
            value:SysDept::new(""),
            code:0
        });
    }

    let usr = LayerMenu::get_by(id).await;
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

#[get("/pri/menu/delete_by_id")]
pub async fn delete_menu_byid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let id = data.get("id").unwrap_or(&def);

    if id.len()<=0{
        return web::Json(DResult {
            value:String::from("编号为空"),
            code: 0,
        });
    }

    let rt= LayerMenu::delete_by(id).await;
    web::Json(rt)
}

#[get("/pri/menu/get_menu_by_userid")]
pub async fn get_menu_by_userid(data: web::Query<HashMap<String, String>>)->impl Responder{
    let def="".to_owned();    
    let user_id = data.get("user_id").unwrap_or(&def);
    
    let rt=LayerMenu::get_list_by_userid(user_id).await;
    web::Json(rt)
}