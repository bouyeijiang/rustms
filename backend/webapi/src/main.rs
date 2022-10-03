use actix_cors::Cors;
use actix_web::{error,dev::Service as _, App, HttpServer,http::header};
use dblink::{Settings,Dbcfg};

pub mod config;
mod controller;
mod jwttoken;
mod models;
mod utils;
use config::*;

use crate::{jwttoken::*};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    //加载配置
    Dbcfg::init_globalcfg();
    Settings::init_globalcfg();

    let setting=Settings::get_globalcfg();
    let url = setting.listen;

    println!("------------------");
    println!("------rustms------");
    println!("------------------");
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
            let mut is_valid_token=true;
 
            //私有方法验证token
            if reqpath.starts_with("/pri/"){
                let headers = req.headers();
                let def = header::HeaderValue::from_str("").unwrap();
                let token = headers.get("Authorization").unwrap_or(&def)
                .to_str().ok().unwrap().replace("Bearer ", "");
    
                if token.len() == 0 {
                     is_valid_token=false;
                }else{
                    let token_claims = Claims::new("", "","","");
                    let val_token = token_claims.valiate_token(&token);
                    is_valid_token = val_token.1;

                    if !is_valid_token{
                        println!("token:{}", token);
                        println!("err:{:?}", val_token.0);
                    }
                }
            }

            let fut = srv.call(req);
            async move {
                let res = fut.await?;
                if is_valid_token { Ok(res)} else {
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
