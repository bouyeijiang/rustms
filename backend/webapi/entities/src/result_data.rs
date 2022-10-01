
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

    pub fn success(value:T)->DResult<T>{
        DResult{
            code:200,
            value:value
        }
    }

    pub fn empty(value:T)->DResult<T>{
        DResult{
            code:0,
            value:value
        }
    }

    pub fn failure(value:T)->DResult<T>{
        DResult{
            code:1,
            value:value
        }
    }

    pub fn error(value:T)->DResult<T>{
        DResult{
            code:-1,
            value:value
        }
    }

    pub fn create(value:T,code:i16)->DResult<T>{
        DResult{
            code:code,
            value:value
        }
    }
    pub fn not_found(value:T)->DResult<T>{
        DResult{
            code:404,
            value:value
        }
    }
    pub fn unauthorized(value:T)->DResult<T>{
        DResult{
            code:401,
            value:value
        }
    }
    pub fn forbidden(value:T)->DResult<T>{
        DResult{
            code:403,
            value:value
        }
    }
//    pub fn from_json(&self,json:&str)->DResult<T> where T:serde::Deserialize<T>{
//        let obj:DResult<T>= serde_json::from_str(json).unwrap();
//        obj
//    }
}
