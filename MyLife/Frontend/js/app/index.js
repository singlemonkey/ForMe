class Sidebar {
    constructor(menus) {
        this.menus = menus;
    }
    render() {
        this.menus.map((e) => {
            alert(e.title);
        });
    }
};
jQuery(document).ready(function () {
    //左侧菜单项设置
    let menuItems = [
        {
            title: "生活动态",
            modules: [
                {
                    title: "说说",
                    url: "",
                    icon:"",
                },
                {
                    title: "博客",
                    url: "",
                    icon: "",
                },
                {
                    title: "设置",
                    url: "",
                    icon: "",
                },
            ]
        },
        {
            title: "资产管理",
            modules: [
                {
                    title: "购物车",
                    url: "",
                    icon: "",
                },
                {
                    title: "资债统计",
                    url: "",
                    icon: "",
                },
            ]
        }
    ];
    let a = new Sidebar(menuItems);
    a.render();
});