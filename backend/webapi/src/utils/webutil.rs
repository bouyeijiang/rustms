use actix_web::{web,HttpRequest,http::header};
use std::collections::HashMap;
use crate::jwttoken::*;

pub struct WebUtil {}

impl WebUtil {
    
    #[allow(dead_code)]
    pub (crate) fn get_token_from_header(req:& HttpRequest)->(Claims,bool){
        let def = header::HeaderValue::from_str("").unwrap();
        let token = req.headers().get("Authorization").unwrap_or(&def)
        .to_str().ok().unwrap().replace("Bearer ", "");

        let claims=Claims::new("","","","");
        if token.len()==0{
            return (claims,false);
        }
        let val_token = claims.valiate_token(&token);
        val_token
    }

    #[allow(dead_code)]
    pub (crate) fn get_page_from_json(data: &web::Json<HashMap<String, String>>) -> (i32, i32) {
        let _page_def = "0".to_owned();
        let _size_def = "10".to_owned();

        let page: i32 = data.get("page").unwrap_or(&_page_def).parse().unwrap_or(0);
        let size: i32 = data.get("size").unwrap_or(&_size_def).parse().unwrap_or(10);

        (page, size)
    }

    #[allow(dead_code)]
    pub (crate) fn get_page_from_query(data: &web::Query<HashMap<String, String>>) -> (i32, i32) {
        let _page_def = "0".to_owned();
        let _size_def = "10".to_owned();

        let page: i32 = data.get("page").unwrap_or(&_page_def).parse().unwrap_or(0);
        let size: i32 = data.get("size").unwrap_or(&_size_def).parse().unwrap_or(10);

        (page, size)
    }
}
