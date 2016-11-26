class Sidebar {

    constructor(menus) {
        this.menus =JSON.parse(window.localStorage.getItem("menuItems"));
    }

    setIsFold(e) {
        let menusStorage = this.menus.map((menu) => {
            if (menu.title == e.textContent) {
                menu.isFold = !menu.isFold;
            }
            return menu;
        });
        window.localStorage.setItem("menuItems", JSON.stringify(menusStorage));
    }

    setIsActive(e) {
        let title = e.textContent;
        let menusStorage=this.menus.map((menu) => {
            menu.modules.map((module) => {
                if (module.title == title) {
                    module.isActive = true;
                } else {
                    module.isActive = false;
                }
                return module;
            });
            return menu;
        });
        window.localStorage.setItem("menuItems", JSON.stringify(menusStorage));
    }

    createDom(menu) {
        var self = this;
        let sidebarNav = $("<div></div>", {
            "class": menu.isFold ? "sidebar-nav sidebar-nav-fold" : "sidebar-nav"
        });
        let sidebarTitle = $("<div></div>", {
            "class": "sidebar-title",
            click: function () {
                sidebarNav.toggleClass("sidebar-nav-fold");
                self.setIsFold(this);
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
                "class": module.isActive ? "nav-item active" : "nav-item "
            });
            let a = $("<a></a>", {
                href: module.url,
                "class": "sidebar-trans",
                click: function () {
                    self.setIsActive(this);
                }
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
                        title: "博客",
                        url: "/Blog/Index",
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
                        title: "日常花销",
                        url: "/Cost/Index",
                        icon: "",
                        isActive: false
                    },
                ]
            },
            {
                title: "设置",
                isFold: false,
                modules: [
                    {
                        title: "字典管理",
                        url: "/Dictionary/DictionaryIndex",
                        icon: "",
                        isActive: false
                    },
                ]
            }
        ]));
    }    
    //左侧菜单项设置
    let menu= new Sidebar();
    $("#sidebar").append(menu.render());
});
