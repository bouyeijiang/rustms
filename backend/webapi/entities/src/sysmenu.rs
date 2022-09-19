use core::fmt;
use std::fmt::Display;
use tokio_postgres::Row;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SysMenu{
    pub id:String,
    pub menu_name:String,
    pub menu_uri:String,
    pub pid:String,
    pub menu_type:i16,
    pub icon:String,
    pub mindex:i32
}

impl Display for SysMenu {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "id:{},menu_name:{},menu_uri:{},pid:{},menu_type:{},icon:{},mindex:{}",
            self.id, self.menu_name, self.menu_uri, self.pid,self.menu_type,self.icon,self.mindex
        )
    }
}

impl From<Row> for SysMenu {
    fn from(row: Row) -> Self {
        Self {
            id: row.get("id"),
            menu_name: row.get("menu_name"),
            menu_type: row.get("menu_type"),
            menu_uri:row.get("menu_uri"),
            pid:row.get("pid"),
            icon:row.get("icon"),
            mindex: row.get("mindex")
        }
    }
}

impl SysMenu {
    pub fn new(name:&str) -> Self {
        Self {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            menu_name: name.to_owned(),
            menu_type:0,
            menu_uri:String::from(""),
            pid:String::from("00000000-0000-0000-0000-000000000000"),
            icon:String::from(""),
            mindex: 0
        }
    }

    pub fn from_vec(rows: Vec<Row>) -> Vec<SysMenu> {
        let list = rows
            .into_iter()
            .map(|row| SysMenu::from(row))
            .collect::<Vec<SysMenu>>();

        list
    }
}
