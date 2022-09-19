use serde::{Deserialize, Serialize};
use crate::sysdept::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TreeNodeDept{
    pub id:String,
    pub title:String,
    pub pid:String,
    pub dindex:i32,
    pub open:bool,
    pub children:Vec<Option<Box<TreeNodeDept>>>
}

impl TreeNodeDept{

    pub fn new(root:SysDept)->Self{
       // let _icon=root.icon.clone();

        Self{
            id:root.id,
            title:root.dept,
            pid:root.pid,
            open:true,
            dindex:root.dindex,
            children:vec![]
        }
    }

    pub fn from_vec(root:&mut Option<Box<TreeNodeDept>>,vec:& Vec<SysDept>){
        TreeNodeDept::recursive_create_tree(root,&vec);
    }

    //递归构建树
    fn recursive_create_tree(root:&mut Option<Box<TreeNodeDept>>,vec:&Vec<SysDept>){
        for item in vec{
             match root{
                Some(rt)=>{
                    if rt.id==item.id{
                        continue;
                    }
                    if rt.id==item.pid{
                        let tree_node=TreeNodeDept::new(item.clone());
                        rt.children.push(Some(Box::new(tree_node)));
                        let take=rt.children.last_mut().unwrap();
                        TreeNodeDept::recursive_create_tree(take,vec);
                    }
                },None=>{
                    break;
                }
             }
        }
    }
}