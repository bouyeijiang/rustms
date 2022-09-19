-- public.sys_role definition

-- Drop table

-- DROP TABLE public.sys_role;

CREATE TABLE public.sys_role (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	role_name varchar(64) NULL DEFAULT ''::character varying, -- 角色名称
	role_type int2 NULL DEFAULT 0, -- 0菜单权限,1数据权限
	gentime timestamp NULL DEFAULT now()
);

-- Column comments

COMMENT ON COLUMN public.sys_role.role_name IS '角色名称';
COMMENT ON COLUMN public.sys_role.role_type IS '0菜单权限,1数据权限';

INSERT INTO public.sys_role (id,role_name,role_type,gentime) VALUES
	 ('7ed97931-acb7-4062-8144-8cb497f7916a','ab',0,'2022-09-18 22:22:27.10538'),
	 ('16af2021-463b-4b43-a25f-da144d8b2874','管理员数据',1,'2022-09-14 18:47:14.277924'),
	 ('01f1feaf-13df-46bd-bae7-9eff03cce8e4','管理员菜单',0,'2022-09-14 18:46:49.92152'),
	 ('911c7c93-9aee-41a4-8289-cd7a55dab756','ab',1,'2022-09-19 13:33:53.41342');
