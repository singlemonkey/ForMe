class Sidebar {

    constructor(menus) {
        this.menus = menus;
    }

    createDom(menu) {
        let sidebarNav = $("<div></div>", {
            "class": menu.isFold ? "sidebar-nav sidebar-nav-fold" : "sidebar-nav"
        });
        let sidebarTitle = $("<div></div>", {
            "class": "sidebar-title",
            click: function () {
                sidebarNav.toggleClass("sidebar-nav-fold");
                var self=this;
                let menusStorage = JSON.parse(window.localStorage.getItem("menuItems")).map((item) => {
                    if (item.title == this.textContent) {
                        item.isFold =!item.isFold;
                    }
                    return item;
                });
                window.localStorage.setItem("menuItems", JSON.stringify(menusStorage));
            }
        });
        let sidebarTitleInner = $("<div></div>", {
            "class": "sidebar-title-inner"
        });
        let sidebarTitleIcon = $("<span></span>", {
            "class": "sidebar-title-icon fa fa-sort-desc"
        });
        let sidebarTitleText = $("<span></span>", {
            "class": "sidebar-title-text",
            text:menu.title
        });
        sidebarTitle.append(sidebarTitleInner.append(sidebarTitleIcon).append(sidebarTitleText));
        let ul = $("<ul></ul>", {
            "class":"sidebar-trans"
        });
        let ulHeight = 0;
        menu.modules.map((module) => {
            let navItem = $("<li></li>", {
                "class": "nav-item"
            });
            let a = $("<a></a>", {
                href: module.url,
                "class":"sidebar-trans"
            });
            let navIcon = $("<div></div>", {
                "class": "nav-icon sidebar-trans"
            });
            let icon = $("<span></span>", {
                "class":"fa "+module.icon
            });
            let navTitle = $("<span></span>", {
                "class": "nav-title",
                text: module.title
            });
            navItem.append(a.append(navIcon.append(icon)).append(navTitle));
            ul.append(navItem);
            ulHeight += 40;
        });
        ul.height(ulHeight);
        sidebarNav.append(sidebarTitle).append(ul);
        return sidebarNav;
    }

    render() {
        let sidebarInner = $("<div class='sidebar-inner'></div>");
        var self = this;
        this.menus.map((e) => {
            sidebarInner.append(self.createDom(e));
        });
        return sidebarInner;
    }
};
jQuery(document).ready(function () {
    let localStorage = window.localStorage;
    if (!localStorage.getItem("menuItems")) {
        localStorage.setItem("menuItems",JSON.stringify([
            {
                title: "生活动态",
                isFold:false,
                modules: [
                    {
                        title: "说说",
                        url: "/Home/Index",
                        icon: "",
                        isActive:false
                    },
                    {
                        title: "博客",
                        url: "/Home/Index",
                        icon: "",
                        isActive: false
                    },
                    {
                        title: "设置",
                        url: "/Home/Index",
                        icon: "",
                        isActive: false
                    },
                ]
            },
            {
                title: "资产管理",
                isFold: false,
                modules: [
                    {
                        title: "购物车",
                        url: "/Home/Index",
                        icon: "",
                        isActive: false
                    },
                    {
                        title: "资债统计",
                        url: "/Home/Index",
                        icon: "",
                        isActive: false
                    },
                ]
            }
        ]));
    }    
    //左侧菜单项设置
    let menuItems =JSON.parse(localStorage.getItem("menuItems"));
    let menu= new Sidebar(menuItems);
    $("#sidebar").append(menu.render());
});
