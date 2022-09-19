-- public.sys_menu definition

-- Drop table

-- DROP TABLE public.sys_menu;

CREATE TABLE public.sys_menu (
	id uuid NULL DEFAULT uuid_generate_v4(),
	menu_name varchar(64) NULL, -- 菜单名称
	menu_uri varchar(256) NULL, -- 菜单路径
	pid uuid NULL, -- 父菜单节点
	menu_type int2 NULL DEFAULT 0, -- 菜单类型,0主菜单,1子菜单,2外部链接
	icon varchar(256) NULL, -- 图标
	mindex int4 NULL DEFAULT 0, -- 排序
	gentime timestamp NULL DEFAULT now()
);

-- Column comments

COMMENT ON COLUMN public.sys_menu.menu_name IS '菜单名称';
COMMENT ON COLUMN public.sys_menu.menu_uri IS '菜单路径';
COMMENT ON COLUMN public.sys_menu.pid IS '父菜单节点';
COMMENT ON COLUMN public.sys_menu.menu_type IS '菜单类型,0主菜单,1子菜单,2外部链接';
COMMENT ON COLUMN public.sys_menu.icon IS '图标';
COMMENT ON COLUMN public.sys_menu.mindex IS '排序';

INSERT INTO public.sys_menu (id,menu_name,menu_uri,pid,menu_type,icon,mindex,gentime) VALUES
	 ('1a75be74-0aaf-40f0-b446-2aef1884a63b','系统菜单','/','00000000-0000-0000-0000-000000000000',0,'icon-system',0,'2022-09-16 19:03:26.687791'),
	 ('f01d4907-09b2-44da-958a-33de6088b575','用户信息','/pages/sys-users/user','7d98f844-d679-4878-a3b2-7a6904765dcb',1,' ',201,'2022-09-16 19:11:08.351602'),
	 ('5720cf32-ae6e-48aa-99bd-7385c4335ac1','角色信息','/pages/sys-role/role','7d98f844-d679-4878-a3b2-7a6904765dcb',1,' ',303,'2022-09-16 19:13:00.164758'),
	 ('9f90397f-a428-4469-b28c-c5ba174f9c2b','首页','/pages/getting-started/portal','c15c6482-95e7-4eab-a5c3-dbbe9c5be6a2',0,' ',101,'2022-09-16 19:08:15.587269'),
	 ('c15c6482-95e7-4eab-a5c3-dbbe9c5be6a2','开始使用','/pages/getting-started','1a75be74-0aaf-40f0-b446-2aef1884a63b',0,'icon icon-console',1,'2022-09-16 19:07:10.120756'),
	 ('34c98bed-26dc-4b3f-83d2-e36780132876','部门信息','/pages/sys-dept/dept','7d98f844-d679-4878-a3b2-7a6904765dcb',1,' ',202,'2022-09-16 19:12:19.497439'),
	 ('7d98f844-d679-4878-a3b2-7a6904765dcb','系统管理','/pages/sys-users','1a75be74-0aaf-40f0-b446-2aef1884a63b',0,'icon icon-member',2,'2022-09-16 19:10:24.061468'),
	 ('7d26b602-b99a-4a1f-a401-277413d38bd0','菜单信息','/pages/sys-menu/menu','7d98f844-d679-4878-a3b2-7a6904765dcb',1,' ',204,'2022-09-18 16:39:50.612074');
