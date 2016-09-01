let localStorage = window.localStorage;
class Bloglist {

    constructor() {
        this.init = localStorage.getItem("blogInit") ? localStorage.getItem("blogInit") : 0;
        localStorage.setItem("blogInit",this.init);
        this.crumbList = $(".list-crumb");
        this.containerList = $(".list-container");
    }

    get _init() {
        return this.init;
    }

    set _init(e) {
        localStorage.setItem("blogInit", e);
        this.getData(e);
    }
    getData(id) {
        let self = this;
        let obj = {
            url: "/Blog/BlogList/?id="+id,
            success: function (result) {
                self.render(result);
            },
            error: function (error) {
                $("html").html(error.responseText);
            }
        }
        $.Ajaxobj(obj);
    }

    render(data) {
        this.renderCrumb(data.crumbList);
        this.renderContainer(data.containerList);
    }

    renderCrumb(result) {
        this.crumbList.html("");
        let l = result.length - 1;
        for (let i = 0; i < l; i++) {
            let a = $("<a></a>", {
                "class": "crumb-item",
                text: result[i].Title,
                "data-id":result[i].ID
            });
            let span = $("<span></span>", {
                "class": "glyphicon glyphicon-menu-right"
            });
            this.crumbList.append(a).append(span);
        }
        let nowCrumb = $("<span></span>", {
            "class":"now-crumb",
            text: result[l].Title
        });
        this.crumbList.append(nowCrumb);
    }

    renderContainer(result) {
        this.containerList.html("");
        let l = result.length;
        if (l != 0) {
            for (let i = 0; i < l; i++) {
                this.renderListItem(result[i]);
            }
        }
    }

    renderListItem(item) {
        let tmpl = $.templates("#blog-item");
        let liItem = tmpl.render(item);
        this.containerList.append(liItem);
    }

    updateTitle(id) {
        let oTitle=$("a[data-id=" + id + "] .item-title");
        let nTitle = $(".file-operations[data-id=" + id + "] .title-input");
        if (oTitle.text() != nTitle.val()) {
            let obj = {
                url: "/Blog/UpdateTitle/",
                data: {
                    ID: id,
                    Title: nTitle.val()
                },
                showProgress:false,
                success: function (result) {
                    oTitle.text(result.Title);
                },
                error: function (error) {
                    $("html").html(error.responseText);
                }
            }
            $.Ajaxobj(obj);
        }
    }

};
jQuery(document).ready(function () {
    let blog = new Bloglist();    
    blog._init = localStorage.getItem("blogInit");

    //调用blog._init方法rerender整个blog
    $(".list-crumb").on("click", ".crumb-item", function () {
        blog._init = $(this).attr("data-id");
    });
    $(".list-container").on("click", "a", function () {
        if ($(this).children().hasClass("folder-content")) {
            blog._init = $(this).attr("data-id");
        } else {
            alert("跳转文档");
        }        
    });

    //点击空白处隐藏所有active窗体
    $(document).on("click", function (e) {
        if ($(".file-operations.active").length == 1) {
            if ($(e.target).parents(".file-operations.active").length == 0) {
                $(".file-operations.active").removeClass("active");
                $(".item-content.hover").removeClass("hover");                
            }
        }        
    });

    //移入移出添加hover样式
    $(".list-container").on("mouseover mouseout",".item-content", function (event) {
        if (event.type == "mouseover") {
            $(this).addClass("hover");
        } else if (event.type == "mouseout") {
            if ($(this).parents(".list-box").children(".file-operations.active").length == 0) {
                $(this).removeClass("hover");
            }
        }
    });

    let MutationObserver = window.WebKitMutationObserver;
    let mutationObserverSupport = !!MutationObserver;
    //点击设置图标显示设置项
    $(".list-container").on("click", ".item-setting", function (e) {
        let id = $(this).parents("a").attr("data-id");
        $(".file-operations.active").filter(function () {
            return $(this).attr("data-id") != id;
        }).removeClass("active");
        $(".item-content.hover").filter(function () {
            return $(this).attr("data-id") != id;
        }).removeClass("hover");
        //监听元素class变化，触发回调函数更新title
        let operation = $(this).parents(".list-box").children(".file-operations");
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes") {
                    blog.updateTitle(id);
                }
            });
            observer.disconnect();
        });
        if (operation.hasClass("active")) {
            operation.removeClass("active");            
        } else {
            operation.addClass("active");            
            let DomOperation = operation.get(0);
            let options = {
                attributes: true,
                childList: true,
                attributesFilter:["class"]
            }
            observer.observe(DomOperation, options);
        }
        e.stopPropagation();
    });

});