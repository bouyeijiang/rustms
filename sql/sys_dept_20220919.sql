-- public.sys_dept definition

-- Drop table

-- DROP TABLE public.sys_dept;

CREATE TABLE public.sys_dept (
	id uuid NULL DEFAULT uuid_generate_v4(),
	dept varchar(64) NULL DEFAULT ''::character varying, -- 部门编号
	pid uuid NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid, -- 父编号
	dindex int4 NULL DEFAULT 0,
	gentime timestamp NULL DEFAULT now()
);
COMMENT ON TABLE public.sys_dept IS '部门表';

-- Column comments

COMMENT ON COLUMN public.sys_dept.dept IS '部门编号';
COMMENT ON COLUMN public.sys_dept.pid IS '父编号';

INSERT INTO public.sys_dept (id,dept,pid,dindex,gentime) VALUES
	 ('20404794-657e-433a-a635-db76498edbd6','总部','00000000-0000-0000-0000-000000000000',0,'2022-09-14 18:45:19.991309'),
	 ('5e386ef9-dc3e-42fb-ae2e-63fec5b9f17d','业务部','20404794-657e-433a-a635-db76498edbd6',1,'2022-09-14 18:46:01.224337'),
	 ('17e4a15d-0315-47fa-ad44-3311e0cb3ec4','美工部','a99070b3-d027-4a1a-98dd-d758d782fea5',2,'2022-09-16 14:11:44.351207'),
	 ('a99070b3-d027-4a1a-98dd-d758d782fea5','开发部','20404794-657e-433a-a635-db76498edbd6',3,'2022-09-14 18:45:39.30748');
