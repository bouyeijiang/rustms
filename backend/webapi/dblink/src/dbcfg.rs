extern crate serde_json;

use std::fs::File;
#[derive(Debug, Clone)]
pub struct Dbcfg {
    pub ip: String,
    pub port: i16,
    pub usr: String,
    pub pwd: String,
    pub database: String,
}

static mut APPCFG:Option<&Dbcfg>=None;

impl Dbcfg {
    pub fn to_pg_connstr(&self) -> String {
        let conn_str = format!(
            "postgres://{}:{}@{}:{}/{}",
            self.usr, self.pwd, self.ip, self.port, self.database
        );
        conn_str
    }

    pub fn new()-> Self{
            return Dbcfg{ip:"127.0.0.1".to_string(),
            port:5432,
            usr:"postgres".to_string(),
            pwd:"".to_string(),
            database:"".to_string()
        };
    }

    pub fn init_globalcfg(){
        let mut cfg=Dbcfg::new();
        cfg.from_config("conf/settings.json");

        let tmp=Box::new(cfg);
       unsafe{
            APPCFG=Some(Box::leak(tmp));    
       }
    }

#[allow(unused_assignments)]
 pub fn get_globalcfg()->Dbcfg{
    let mut cfg=Dbcfg::new();
    unsafe{
        let n=APPCFG.unwrap();
        cfg=n.clone();
        }
   cfg
 }

    pub fn from_config(&mut self,path:&str){
        let f=File::open(path).expect("not found the settings.json file");
        let json:serde_json::Value=serde_json::from_reader(f).unwrap();

        let val=&json["postgres"];
        
        let port:i16=val["port"].as_i64().unwrap_or(5432) as i16;
        let ip=val["ip"].as_str().unwrap_or("127.0.0.1").to_string();
        let usr=val["user"].as_str().unwrap_or("postgres").to_string();
        let pwd=val["pwd"].as_str().unwrap_or("").to_string();
        let db=val["database"].as_str().unwrap_or("postgres").to_string();

        self.database=db;
        self.ip=ip;
        self.usr=usr;
        self.pwd=pwd;
        self.port=port;
    }
}
