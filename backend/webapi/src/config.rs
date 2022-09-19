use crate::controller::sys_auth::*;
use crate::controller::sys_user::*;
use crate::controller::sys_dept::*;
use crate::controller::sys_menu::*;
use crate::controller::sys_role::*;
use actix_files as fs;
use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(do_login)
        .service(get_user_list)
        .service(add_update_user)
        .service(delete_user_byid)
        .service(get_user_by_id)
        .service(get_portal_pie)

        .service(get_dept_list)
        .service(add_update_dept)
        .service(delete_dept_byid)
        .service(get_dept_byid)

        .service(get_dept_list)
        .service(add_update_dept)
        .service(delete_dept_byid)
        .service(get_dept_byid)
        .service(get_list_tree)

        .service(get_menu_list)
        .service(add_update_menu)
        .service(delete_menu_byid)
        .service(get_menu_byid)
        .service(get_menu_by_userid)

        .service(get_role_list)
        .service(add_update_role)
        .service(delete_role_byid)
        .service(get_rigth_byid)
        .service(get_role_byid)

        .service(fs::Files::new("/statics", "resources/statics/").prefer_utf8(true))
        .service(fs::Files::new("/assets", "resources/pages/assets/").prefer_utf8(true))
        .service(fs::Files::new("/", "resources/pages/").prefer_utf8(true));
}
