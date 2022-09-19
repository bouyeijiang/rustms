export default function (values: any) {
    return [
        {
            title: '开始使用',
            open: true,
            link: '/pages/getting-started',
            data:{
                icon: 'icon icon-console'
            },
            children: [
                {
                    title: '首页',
                    link: '/pages/getting-started/portal',
                },
            ]
        },
        {
            title: '授权管理',
            open: true,
            link: '/pages/app-users',
            data:{
                icon: 'icon icon-identity-auth'
            },
            children: [
                {
                    title: '授权信息',
                    link: '/pages/app-users/auth'
                }
            ]
        },
        {
            title:'系统管理',
            open: true,
            link: '/pages/sys-users',
            data:{
                icon: 'icon icon-member'
            },
            children: [
                {
                    title: '用户信息',
                    link: '/pages/sys-users/user',
                },
                {
                    title: '部门信息',
                    link: '/pages/sys-dept/dept',
                },
                {
                    title: '角色信息',
                    link: '/pages/sys-role/role',
                },
                {
                    title: '菜单信息',
                    link: '/pages/sys-menu/menu',
                }
            ]
        },
    ];
}