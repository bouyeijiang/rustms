pub struct  StrUtil{}

impl StrUtil{
    pub fn begin_math(_main_str:String,_sub_str:String)->bool{
        let m=_main_str.as_bytes();
        let s=_sub_str.as_bytes();

        if s.len()>m.len(){
            return false;
        }

        for i in 0..s.len(){
            if s[i]!=m[i]{
                return false;
            }
        }
        return true;
    }

    pub fn end_math(_main_str:String,_sub_str:String)->bool{
        let m=_main_str.as_bytes();
        let s=_sub_str.as_bytes();

        if s.len()>m.len(){
            return false;
        }

        let cnt=s.len();
        for i in 0..cnt{
            if s[cnt-1-i]!=m[cnt-1-i]{
                return false;
            }
        }
        return true;
    }

    pub fn str_contain(_sub_str:String,str_arry:Vec<String>)->bool{
        for _str in str_arry.iter(){
            if _sub_str.eq(_str){
                return true;
            }
        }
        return false;
    }
}