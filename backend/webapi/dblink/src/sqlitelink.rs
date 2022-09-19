//use std::collections::HashMap;

//use sqlite::{Connection,Error};

#[allow(dead_code)]
pub struct SqliteLink{}


// impl SqliteLink{
// pub fn db_execute(db_path: &str, command_text: &str) -> usize {
//     let conn =  Connection::open(db_path).unwrap();
   
//     conn.execute(command_text).unwrap();
//     conn.change_count()
// }

// pub fn db_query(db_path:&str,command_text:&str)->Result<Vec<HashMap<String,String>>,Error>{
//     let conn =  Connection::open(db_path)?;
//     let mut arry=Vec::new();

//     conn.iterate(command_text, |pairs|{
//         let mut hash:HashMap<String,String>=HashMap::new();

//         for &(column, value) in pairs.iter() {
//           let val=match value {
//             Some(v)=>{v},
//             None=>{ ""}
//         };
//           hash.insert(column.to_string(), val.to_string());
//          }
//       arry.push(hash);
//       true
//     }).unwrap();
  
//     Ok(arry)
// }

// pub fn db_query_one(db_path:&str,command_text:&str)->Result<HashMap<String,String>,Error>{

//     let conn =  Connection::open(db_path)?;
//     let mut hash:HashMap<String,String>=HashMap::new();

//    conn.iterate(command_text,|pairs|{
    
//         for &(column, value) in pairs.iter() {
//           let val=match value {
//             Some(v)=>{v},
//             None=>{ ""}
//         };

//         hash.insert(column.to_string(), val.to_string());
//       }
//     false
//     }).unwrap_or_default();

//     Ok(hash)
// }
// }