use serde::{Deserialize, Serialize};

use crate::SysUser;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenResult{
   pub token:String,
   pub expired:i64,
   pub user_info:SysUser
}

impl TokenResult{
   pub fn to_json(&self)->String{
       serde_json::to_string(self).unwrap()
   }
}