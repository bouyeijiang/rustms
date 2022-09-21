use actix_web::error;
use actix_cors::Cors;
use actix_web::{dev::Service as _, App, HttpServer,http::header};
use dblink::Settings;
pub mod config;
mod controller;
mod jwttoken;
mod models;
mod utils;
use crate::{jwttoken::*};
use config::*;
use dblink::Dbcfg;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    //加载配置
    Dbcfg::init_globalcfg();
    Settings::init_globalcfg();

    let setting=Settings::get_globalcfg();
    let url = setting.listen;

    println!("listening:{}", url);
     
    HttpServer::new(|| {
        let cors= Cors::default()
        .allow_any_origin()
        .allowed_methods(vec!["GET", "POST","OPTIONS"])
        .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
        .allowed_header(header::CONTENT_TYPE)
        .max_age(3600);

        App::new()
        .wrap(cors)
        .configure(config)
        .wrap_fn(|req, srv| {
            let reqpath = req.path().to_string();
            let headers = req.headers().clone();

            let fut = srv.call(req);
            async move {
                let res = fut.await?;
                if !reqpath.starts_with("/pri/") {
                    return Ok(res);
                }

                let def = header::HeaderValue::from_str("").unwrap();
                 let token = headers.get("Authorization").unwrap_or(&def)
                 .to_str().ok().unwrap().replace("Bearer ", "");

                if token.len() == 0 {
                    let rt=r#"{"value":"Invalid Token","code":401}"#;
                    return Err(error::ErrorUnauthorized(rt));
                }
                let token_claims = Claims::new("", "");
                let val_token = token_claims.valiate_token(&token);
                let is_ok = val_token.1;

                if is_ok { Ok(res)} else {
                    println!("{:?}", val_token.0);
                     let rt=r#"{"value":"ErrorUnauthorized","code":401}"#;
                     let err=error::ErrorUnauthorized(rt);
                     Err(error::ErrorUnauthorized(err))
                }
            }
        })
    })
    .bind(url)?
    .run()
    .await
}
