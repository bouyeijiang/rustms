use core::fmt;
use std::fmt::Display;
use tokio_postgres::Row;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SysUser {
    pub id: String,
    pub uname: String,
    pub phone: String,
    pub realname:String,
    pub sex: String,
    pub utype: i16,
    pub status: i16,
    pub dept_id:String,
    pub dept:String,
    pub menu_role_id:String,
    pub data_role_id:String,
    pub gentime:String
}

impl Display for SysUser {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "id:{},uname:{},phone:{},sex:{},utype:{},status:{}",
            self.id, self.uname, self.phone, self.sex, self.utype, self.status
        )
    }
}

impl From<Row> for SysUser {
    fn from(row: Row) -> Self {

        if row.is_empty(){
            return SysUser::new();
        }

        let uuid_def="00000000-0000-0000-0000-000000000000".to_owned();

        Self {
            id: row.get("id"),
            uname: row.get("uname"),
            realname:row.try_get("realname").unwrap_or("".to_owned()),
            phone: row.try_get("phone").unwrap_or("".to_owned()),
            sex: row.try_get("sex").unwrap_or("".to_owned()),
            utype: row.try_get("utype").unwrap_or(0),
            status: row.try_get("status").unwrap_or(0),
            dept:row.try_get("dept").unwrap_or("".to_owned()),
            dept_id:row.try_get("dept_id").unwrap_or(uuid_def.clone()),
            menu_role_id:row.try_get("menu_role_id").unwrap_or(uuid_def.clone()),
            data_role_id:row.try_get("data_role_id").unwrap_or(uuid_def.clone()),
            gentime:row.try_get("gentime").unwrap_or("".to_owned()),
        }
    }
}

impl SysUser {
    pub fn new() -> Self {
        Self {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            uname: String::from(""),
            realname: String::from(""),
            phone: String::from(""),
            sex: String::from(""),
            utype: 0,
            status: 0,
            dept:String::from(""),
            dept_id:String::from("00000000-0000-0000-0000-000000000000"),
            menu_role_id:String::from("00000000-0000-0000-0000-000000000000"),
            data_role_id:String::from("00000000-0000-0000-0000-000000000000"),
            gentime:String::from("2001-01-01")
        }
    }

    pub fn from_vec(rows: Vec<Row>) -> Vec<SysUser> {
        let list = rows
            .into_iter()
            .map(|row| SysUser::from(row))
            .collect::<Vec<SysUser>>();

        list
    }
}
