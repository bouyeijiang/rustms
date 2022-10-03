extern crate serde_json;

use std::fs::File;
#[derive(Debug, Clone)]
pub struct Settings {
    pub listen: String,
    pub expired:i64
}

static mut APPSETTING:Option<&Settings>=None;

impl Settings{
    pub fn new()-> Self{
        return Settings
        {
            listen:"0.0.0.0:8088".to_string(),
            expired:3600
        };
    }

    pub fn from_config(&mut self,path:&str){
        let f=File::open(path).expect("not found the settings.json file");
        let json:serde_json::Value=serde_json::from_reader(f).unwrap();

        let listen=json["listen"].as_str().unwrap_or("0.0.0.0:8088").to_string();
        let expired=json["expired"].as_i64().unwrap_or(3600);
        self.listen=listen;
        self.expired=expired;
    }

    pub fn init_globalcfg(){
        let mut cfg=Settings::new();
        cfg.from_config("conf/settings_dev.json");

        let tmp=Box::new(cfg);
       unsafe{
            APPSETTING=Some(Box::leak(tmp));    
       }
    }

#[allow(unused_assignments)]
 pub fn get_globalcfg()->Settings{
    let mut cfg=Settings::new();
    unsafe{
        let n=APPSETTING.unwrap();
        cfg=n.clone();
        }
   cfg
 }
}