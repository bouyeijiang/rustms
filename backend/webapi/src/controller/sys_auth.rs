use crate::{models::{layer_user::LayerUser}};
use actix_web::{post,get, Responder,web};
use regex::Regex;
use entities::*;

#[post("/pub/auth/do_login")]
pub async fn do_login(val: web::Json<DtoLogin>) -> impl Responder {
    if val.uname.chars().count() < 2 || val.upwd.chars().count() < 32 {
        let rt = DResult::failure(String::from("账户或密码长度不符"));
        return web::Json(rt);
    }

    let reg=Regex::new(r"^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$").unwrap();
    if !reg.is_match(val.uname.as_str()) 
    || !reg.is_match(val.upwd.as_str()){
        return web::Json(DResult::failure(String::from("输入只包含数字或字母用户名或密码")));
    }

    let result = LayerUser::sys_user_login(&val.uname, &val.upwd).await;
    match result {
        Ok(r) => web::Json(DResult::success(r.to_json())),
        Err(e) => web::Json(DResult::failure(e.msg)),
    }
}

#[get("/pub/auth/do_401")]
pub async fn do_401()->impl Responder{
    println!("{}",401);
    web::Json(DResult::unauthorized("Unauthorized"))
}

#[get("/pub/auth/do_403")]
pub async fn do_403()->impl Responder{
    println!("{}",403);
    web::Json(DResult::forbidden("No Permission"))
}