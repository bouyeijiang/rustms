
use serde::{Serialize, Deserialize};

#[derive(Debug,Serialize, Deserialize)]
pub struct DResult<T> {
    pub code: i16,
    pub value: T,
}

impl <T:serde::Serialize> DResult<T>{
    pub fn to_json(&self)->String{
        // let s=DResult{
        //     code:self.code,
        //     value:self.value.
        // };
        serde_json::to_string(self).unwrap()
    }

//    pub fn from_json(&self,json:&str)->DResult<T> where T:serde::Deserialize<T>{
//        let obj:DResult<T>= serde_json::from_str(json).unwrap();
//        obj
//    }
}
