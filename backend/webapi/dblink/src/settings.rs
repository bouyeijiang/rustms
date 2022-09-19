extern crate serde_json;

use std::fs::File;
#[derive(Debug, Clone)]
pub struct Settings {
    pub listen: String,
    pub aeskey: String,
    pub db_tmp:String,
    pub rtmp:String,
    pub ztmp:String,
    pub byemap:String,
    pub byedata:String
}

static mut APPSETTING:Option<&Settings>=None;

impl Settings{
    pub fn new()-> Self{
        return Settings
        {
            listen:"0.0.0.0:8088".to_string(),
            aeskey:"".to_string(),
            db_tmp:"".to_string(),
            rtmp:"".to_string(),
            ztmp:"".to_string(),
            byedata:"".to_string(),
            byemap:"".to_string(),
        };
    }

    pub fn from_config(&mut self,path:&str){
        let f=File::open(path).expect("not found the settings.json file");
        let json:serde_json::Value=serde_json::from_reader(f).unwrap();

        let listen=json["listen"].as_str().unwrap_or("0.0.0.0:8088").to_string();
        let aeskey=json["aeskey"].as_str().unwrap_or("").to_string();
        let db_tmp=json["db_tmp"].as_str().unwrap_or("").to_string();
        let rtmp=json["rtmp"].as_str().unwrap_or("").to_string();
        let ztmp=json["ztmp"].as_str().unwrap_or("").to_string();
        // let byemap=json["byemap"].as_str().unwrap_or("").to_string();
        // let byedata=json["byedata"].as_str().unwrap_or("").to_string();

        self.listen=listen;
        self.aeskey=aeskey;
        self.db_tmp=db_tmp;
        self.rtmp=rtmp;
        self.ztmp=ztmp;
        self.byemap=format!("{}byemap.db",self.db_tmp.clone());
        self.byedata=format!("{}byedata.db",self.db_tmp.clone());
    }

    pub fn init_globalcfg(){
        let mut cfg=Settings::new();
        cfg.from_config("conf/settings.json");

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