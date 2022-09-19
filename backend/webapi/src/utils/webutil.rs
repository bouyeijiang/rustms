use actix_web::web;
use std::collections::HashMap;

pub struct WebUtil {}

impl WebUtil {
    
    #[allow(dead_code)]
    pub fn get_page_from_json(data: &web::Json<HashMap<String, String>>) -> (i32, i32) {
        let _page_def = "0".to_owned();
        let _size_def = "10".to_owned();

        let page: i32 = data.get("page").unwrap_or(&_page_def).parse().unwrap_or(0);
        let size: i32 = data.get("size").unwrap_or(&_size_def).parse().unwrap_or(10);

        (page, size)
    }

    pub fn get_page_from_query(data: &web::Query<HashMap<String, String>>) -> (i32, i32) {
        let _page_def = "0".to_owned();
        let _size_def = "10".to_owned();

        let page: i32 = data.get("page").unwrap_or(&_page_def).parse().unwrap_or(0);
        let size: i32 = data.get("size").unwrap_or(&_size_def).parse().unwrap_or(10);

        (page, size)
    }
}
