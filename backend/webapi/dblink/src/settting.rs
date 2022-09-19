use std::fs::File;
extern crate serde_json;

#[derive(Debug, Clone)]
pub struct Setting {
    pub listen: String,
    pub config:Dbcfg
}

impl Setting{
    pub fn reloading(&mut self,path:&str){
        let f=File::open(path).expect("not found the settings.json file");
        let val:serde_json::Value=serde_json::from_reader(f).unwrap();

        self.listen=val["listen"].as_str();
        let cfg=val["postgres"];

        self.config=Dbcfg{
            ip:cfg["ip"].as_str().unwrap_or("127.0.0.1").to_string(),
            port:cfg["port"].as_i64().unwrap_or(5432) as i16,
            usr:cfg["usr"].as_str().unwrap_or("postgres").to_string(),
            pwd:cfg["pwd"].as_str().unwrap_or("").to_string(),
            database:cfg["database"].as_str().unwrap_or("postgres").to_string()
        };
    }
}