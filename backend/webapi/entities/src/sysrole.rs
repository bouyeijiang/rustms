use core::fmt;
use std::fmt::Display;
use tokio_postgres::Row;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SysRole{
   pub id:String,
   pub role_name:String,
   pub role_type:i16,
}

impl Display for SysRole {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "id:{},role_name:{},role_type:{}",
            self.id, self.role_name, self.role_type
        )
    }
}

impl From<Row> for SysRole {
    fn from(row: Row) -> Self {
        Self {
            id: row.get("id"),
            role_name: row.get("role_name"),
            role_type: row.get("role_type")
        }
    }
}

impl SysRole {
    pub fn new() -> Self {
        Self {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            role_name: String::from(""),
            role_type: 0
        }
    }

    pub fn from_vec(rows: Vec<Row>) -> Vec<SysRole> {
        let list = rows
            .into_iter()
            .map(|row| SysRole::from(row))
            .collect::<Vec<SysRole>>();

        list
    }
}
