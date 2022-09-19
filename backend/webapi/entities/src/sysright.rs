use core::fmt;
use std::fmt::Display;
use tokio_postgres::Row;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SysRight{
    pub id:String,
    pub role_id:String,
    pub relate_id:String,
    pub right_value:String,
}

impl Display for SysRight {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "id:{},role_id:{},relate_id:{},right_value:{}",
            self.id, self.role_id, self.relate_id, self.right_value
        )
    }
}

impl From<Row> for SysRight {
    fn from(row: Row) -> Self {
        Self {
            id: row.get("id"),
            role_id: row.try_get("role_id").unwrap_or("00000000-0000-0000-0000-000000000000".to_owned()),
            relate_id: row.try_get("relate_id").unwrap_or("00000000-0000-0000-0000-000000000000".to_owned()),
            right_value: row.try_get("right_value").unwrap_or("".to_owned())
        }
    }
}

impl SysRight {
    pub fn new() -> Self {
        Self {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            role_id:String::from("00000000-0000-0000-0000-000000000000"),
            relate_id: String::from("00000000-0000-0000-0000-000000000000"),
            right_value:  String::from("")
        }
    }

    pub fn from_vec(rows: Vec<Row>) -> Vec<SysRight> {
        let list = rows
            .into_iter()
            .map(|row| SysRight::from(row))
            .collect::<Vec<SysRight>>();

        list
    }
}
