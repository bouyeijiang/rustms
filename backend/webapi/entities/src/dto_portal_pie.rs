use serde::{Deserialize, Serialize};
use tokio_postgres::Row;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DtoPortalPie{
pub ym:String,
pub total:i32,
pub b_total:i32,
pub c_total:i32
}

impl From<Row> for DtoPortalPie {
   fn from(row: Row) -> Self {
        Self {
            ym: row.get("ym"),
            total: row.get("total"),
            b_total: row.get("b_total"),
            c_total:row.get("c_total")
        }
    }

}

impl DtoPortalPie{
    pub fn new() -> Self {
        Self {
            ym: String::from(""),
            total: 0,
            b_total: 0,
            c_total:0
        }
    }

     pub fn from_vec(rows: Vec<Row>) -> Vec<DtoPortalPie> {
        let list = rows
            .into_iter()
            .map(|row| DtoPortalPie::from(row))
            .collect::<Vec<DtoPortalPie>>();

        list
    }
}