use serde::{Deserialize, Serialize};
use crate::sysmenu::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TreeNodeMenu{
    pub id:String,
    pub title:String,
    pub link:String,
    pub pid:String,
    pub menu_type:i16,
    pub mindex:i32,
    pub open:bool,
    pub data:Option<Box<TreeData>>,
    pub children:Vec<Option<Box<TreeNodeMenu>>>
}

impl TreeNodeMenu{

    pub fn new(root:SysMenu)->Self{
       // let _icon=root.icon.clone();

        Self{
            id:root.id,
            title:root.menu_name,
            link:root.menu_uri,
            pid:root.pid,
            open:true,
            menu_type:root.menu_type,
            mindex:root.mindex,
            data:Some(Box::new(TreeData::new(root.icon.as_str()))),
            children:vec![]
        }
    }

    pub fn from_vec(root:&mut Option<Box<TreeNodeMenu>>,vec:& Vec<SysMenu>){
        TreeNodeMenu::recursive_create_tree(root,&vec);
    }

    //递归构建树
    fn recursive_create_tree(root:&mut Option<Box<TreeNodeMenu>>,vec:&Vec<SysMenu>){
        for item in vec{
             match root{
                Some(rt)=>{
                    if rt.id==item.id{
                        continue;
                    }
                    if rt.id==item.pid{
                        let tree_node=TreeNodeMenu::new(item.clone());
                        rt.children.push(Some(Box::new(tree_node)));
                        let take=rt.children.last_mut().unwrap();
                        TreeNodeMenu::recursive_create_tree(take,vec);
                    }
                },None=>{
                    break;
                }
             }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TreeData{
    pub icon:String
}

impl TreeData{
    pub fn new(icon:&str)->Self{
        Self{
            icon:icon.to_owned()
        }
    }
}