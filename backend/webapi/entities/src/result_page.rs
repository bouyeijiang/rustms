
use serde::{Serialize, Deserialize};

#[derive(Debug,Serialize, Deserialize)]
pub struct PResult<T>{
    pub code: i16,
    pub total:i64,
    pub value: T,
    pub message:String
}

impl <T:serde::Serialize> PResult<T>{
    pub fn to_json(&self)->String{
        serde_json::to_string(self).unwrap()
    }

    pub fn success(value:T,total:i64)->PResult<T>{
        PResult{
            code:200,
            total:total,
            value:value,
            message:String::from("")
        }
    }

    pub fn failure(value:T,message:String)->PResult<T>{
        PResult{
            code:0,
            total:0,
            value:value,
            message:message
        }
    }
}