use chrono::Local;

#[allow(dead_code)]
pub struct Util{}

impl Util{
    
    #[allow(dead_code)]
    pub fn date_time_fmt(fmt:&str)->String{

        if fmt.len()==0{
           return Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        }

        let date_str=Local::now().format(fmt).to_string();
        date_str
    }

    #[allow(dead_code)]
    pub fn date_time_mills()->i64{
        Local::now().timestamp_millis()
    }

    #[allow(dead_code)]
    pub fn date_time_nanos()->i64{
        Local::now().timestamp_nanos()
    }
}