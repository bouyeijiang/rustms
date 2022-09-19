use core::fmt;
use std::fmt::Display;
use tokio_postgres::Row;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SysDept{
    pub id:String,
    pub dept:String,
    pub pid:String,
    pub dindex:i32,
}

impl Display for SysDept {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "id:{},dept:{},pid:{},dindex:{}",
            self.id, self.dept, self.pid, self.dindex
        )
    }
}

impl From<Row> for SysDept {
    fn from(row: Row) -> Self {
        Self {
            id: row.get("id"),
            dept: row.get("dept"),
            pid: row.try_get("pid").unwrap_or("00000000-0000-0000-0000-000000000000".to_owned()),
            dindex: row.try_get("dindex").unwrap_or(0)
        }
    }
}

impl SysDept {
    pub fn new(_dept:&str) -> Self {
        Self {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            dept: _dept.to_owned(),
            pid: String::from("00000000-0000-0000-0000-000000000000"),
            dindex: 0
        }
    }

    pub fn from_vec(rows: Vec<Row>) -> Vec<SysDept> {
        let list = rows
            .into_iter()
            .map(|row| SysDept::from(row))
            .collect::<Vec<SysDept>>();

        list
    }
}
