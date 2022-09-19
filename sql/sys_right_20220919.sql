-- public.sys_right definition

-- Drop table

-- DROP TABLE public.sys_right;

CREATE TABLE public.sys_right (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	role_id uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- 角色编号
	relate_id uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- role_type:0为菜单编号,role_type:1为部门编号
	gentime timestamp NULL DEFAULT now(),
	right_value varchar(256) NULL DEFAULT ''::character varying -- 权限值
);

-- Column comments

COMMENT ON COLUMN public.sys_right.role_id IS '角色编号';
COMMENT ON COLUMN public.sys_right.relate_id IS 'role_type:0为菜单编号,role_type:1为部门编号';
COMMENT ON COLUMN public.sys_right.right_value IS '权限值';

INSERT INTO public.sys_right (id,role_id,relate_id,gentime,right_value) VALUES
	 ('aedd652e-ccdc-40a5-98bc-509d6beebbf5','01f1feaf-13df-46bd-bae7-9eff03cce8e4','f01d4907-09b2-44da-958a-33de6088b575','2022-09-19 10:31:09.455946','/pages/sys-users/user'),
	 ('c2a8fffc-52fe-40f3-9fcb-4522ae2dee77','01f1feaf-13df-46bd-bae7-9eff03cce8e4','34c98bed-26dc-4b3f-83d2-e36780132876','2022-09-19 10:31:09.455946','/pages/sys-dept/dept'),
	 ('8fd7c576-c6bc-41fe-a1ec-c1ef0d2c2aec','01f1feaf-13df-46bd-bae7-9eff03cce8e4','7d26b602-b99a-4a1f-a401-277413d38bd0','2022-09-19 10:31:09.455946','/pages/sys-menu/menu'),
	 ('ae0f776a-8f5c-46f6-b1e0-27b884b4fc7c','01f1feaf-13df-46bd-bae7-9eff03cce8e4','9f90397f-a428-4469-b28c-c5ba174f9c2b','2022-09-19 10:31:09.455946','/pages/getting-started/portal'),
	 ('e9dbb4ec-15c0-4e6b-9c3c-d2c5abf49d2f','01f1feaf-13df-46bd-bae7-9eff03cce8e4','1a75be74-0aaf-40f0-b446-2aef1884a63b','2022-09-19 10:31:09.455946','/'),
	 ('a88d9c08-5c12-4cbd-8a83-8e18c04d7a6c','01f1feaf-13df-46bd-bae7-9eff03cce8e4','5720cf32-ae6e-48aa-99bd-7385c4335ac1','2022-09-19 10:31:09.455946','/pages/sys-role/role'),
	 ('8e86ad6d-5c7f-42f6-b1f4-4d74649e5ae5','7ed97931-acb7-4062-8144-8cb497f7916a','9f90397f-a428-4469-b28c-c5ba174f9c2b','2022-09-19 10:31:24.828009','/pages/getting-started/portal'),
	 ('c08c567c-e902-4c67-b627-c89a7e23ebec','7ed97931-acb7-4062-8144-8cb497f7916a','f01d4907-09b2-44da-958a-33de6088b575','2022-09-19 10:31:24.828009','/pages/sys-users/user'),
	 ('7989b6b6-2c9d-411a-af3f-b6cd08989a8c','7ed97931-acb7-4062-8144-8cb497f7916a','34c98bed-26dc-4b3f-83d2-e36780132876','2022-09-19 10:31:24.828009','/pages/sys-dept/dept'),
	 ('f2b156e3-d856-4a64-9caa-c99d886bbf32','16af2021-463b-4b43-a25f-da144d8b2874','17e4a15d-0315-47fa-ad44-3311e0cb3ec4','2022-09-19 12:21:43.283307','Query:Add:Update:Delete');
INSERT INTO public.sys_right (id,role_id,relate_id,gentime,right_value) VALUES
	 ('4f3fa13d-df01-4869-bef3-ce290bcce3b5','911c7c93-9aee-41a4-8289-cd7a55dab756','5e386ef9-dc3e-42fb-ae2e-63fec5b9f17d','2022-09-19 13:33:53.41342','Query:Add:Update:Delete');
