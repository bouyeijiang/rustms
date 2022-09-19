-- public.sys_user definition

-- Drop table

-- DROP TABLE public.sys_user;

CREATE TABLE public.sys_user (
	id uuid NULL DEFAULT uuid_generate_v4(),
	uname varchar(64) NULL,
	realname varchar(32) NULL,
	phone varchar(16) NULL,
	upwd varchar(1024) NULL,
	sex varchar(2) NULL,
	status int2 NULL,
	utype int2 NULL DEFAULT 0,
	dept_id uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- 部门编号
	menu_role_id uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- 角色编号
	gentime timestamp NULL DEFAULT now(),
	data_role_id uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid -- 数据角色编号
);

-- Column comments

COMMENT ON COLUMN public.sys_user.dept_id IS '部门编号';
COMMENT ON COLUMN public.sys_user.menu_role_id IS '角色编号';
COMMENT ON COLUMN public.sys_user.data_role_id IS '数据角色编号';

INSERT INTO public.sys_user (id,uname,realname,phone,upwd,sex,status,utype,dept_id,menu_role_id,gentime,data_role_id) VALUES
	 ('00000000-0000-0000-0000-000000000000','admin','admin','18212004770','FE85E814FD656A2D490B842C6D33019D','女',0,1,'20404794-657e-433a-a635-db76498edbd6','01f1feaf-13df-46bd-bae7-9eff03cce8e4','2022-09-14 18:44:45.1638','16af2021-463b-4b43-a25f-da144d8b2874'),
	 ('058d25c6-c820-4e57-a591-e7df6f3e0726','test','hkj','18212003445','FE85E814FD656A2D490B842C6D33019D','女',0,0,'a99070b3-d027-4a1a-98dd-d758d782fea5','01f1feaf-13df-46bd-bae7-9eff03cce8e4','2022-09-15 16:53:27.6183','16af2021-463b-4b43-a25f-da144d8b2874'),
	 ('3ce667a7-6cca-42da-b638-d95f9a9f5119','ad','ad','18212003445','FE85E814FD656A2D490B842C6D33019D','女',0,1,'20404794-657e-433a-a635-db76498edbd6','7ed97931-acb7-4062-8144-8cb497f7916a','2022-09-18 20:46:50.928088','16af2021-463b-4b43-a25f-da144d8b2874');
