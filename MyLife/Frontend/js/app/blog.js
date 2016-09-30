let localStorage = window.localStorage;
let MutationObserver = window.WebKitMutationObserver;
let mutationObserverSupport = !!MutationObserver;
class Bloglist {

    constructor() {
        this.data = localStorage.getItem("blogData") ? localStorage.getItem("blogData") : 0;
        this.mode = localStorage.getItem("blogMode") ? localStorage.getItem("blogMode") : "Tile";
        localStorage.setItem("blogData", this.data);
        localStorage.setItem("blogMode", this.mode);
        this.crumbList = $(".list-crumb");
        this.containerList = $(".list-container");
        this.dialog = null;
        this.result = null;
    }

    Init(blogData, blogMode) {
        localStorage.setItem("blogData", blogData);
        localStorage.setItem("blogMode", blogMode);
        this.setMode(blogMode);
        this.getData(blogData);
    }

    getData(dataID) {
        let self = this;
        let obj = {
            url: "/Blog/BlogList/?id=" + dataID,
            success: function (result) {
                self.result = result;
                self.render(result);
            }
        }
        $.Ajaxobj(obj);
    }

    switchMode(e) {
        this.mode = e;
        localStorage.setItem("blogMode", e);
        this.setMode(e);
        this.render(this.result);
    }

    setMode(e) {
        let icon = $(".list-switch>i");
        let modeName = $(".list-switch>span");
        if (e === "Tile") {
            icon.removeClass("fa-th-large").addClass("fa-list-ul");
            modeName.text("列表");            
        }
        else {
            icon.removeClass("fa-list-ul").addClass("fa-th-large");
            modeName.text("平铺");
        }
    }

    render(data) {
        this.renderCrumb(data.crumbList);
        this.renderContainer(data.containerList);
        if (this.mode === "Tile") {
            this.initInteractions();
        }
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
        $(".list-switch").show();
    }

    renderContainer(result) {
        this.containerList.html("").addClass(this.mode);
        let l = result.length;
        if (l != 0) {
            for (let i = 0; i < l; i++) {
                this.renderListItem(result[i]);
            }
        }
    }

    renderListItem(item) {
        let tmpl;
        if (this.mode === "Tile") {
            tmpl = $.templates("#blog-tile");
        } else {
            tmpl = $.templates("#blog-list");
        }
        let liItem = tmpl.render(item);
        this.containerList.append(liItem);
    }

    initInteractions() {
        let self = this;
        $(".list-container").sortable({
            cursor:"pointer",
            helper:function(a,u){
                if (u.find(".item-content").hasClass("doc-content")) {
                    $(".list-container").sortable("option","cursorAt",{
                        left: 30,
                        top:32
                    });
                    return $("<a></a>", {
                        id: "sortHelper-doc"
                    });
                } else {
                    $(".list-container").sortable("option", "cursorAt", {
                        left:40,
                        top: 22
                    });
                    return $("<a></a>", {
                        id: "sortHelper-folder"
                    });
                }
            },
            placeholder: "item-placeholder",
            start:function(event,ui){
                $(this).addClass("onDrag");
            },
            stop: function (event, ui) {
                $(this).removeClass("onDrag");
            },
        }).disableSelection();

        $(".folder-content").droppable({
            activeClass: "droppable",
            addClasses: false,
            hoverClass: "drophover",
            drop: function (event, ui) {
                self.resetStructure(ui.draggable, this);
            }
        });
        $(".crumb-item").droppable({
            activeClass: "droppable",
            addClass: false,
            hoverClass: "drophover",
            drop: function (event, ui) {
                self.resetStructure(ui.draggable, this);
            }
        });
    }

    resetStructure(drag,_this) {
        let id = drag.find(".item-content").attr("data-id");
        let parentId = $(_this).attr("data-id");
        drag.remove();
        let obj = {
            showProgress:false,
            url: "/Blog/ResetStructure/?ID=" + id+"&parentID="+parentId,
            success: function (){}
        }
        $.Ajaxobj(obj);
    }

    setOperation(setting) {
        let self = this;
        let id = $(setting).parents("a").attr("data-id");
        let contentType=$(setting).parents(".item-content").hasClass("doc-content")?"doc":"folder";
        $(".file-operations.active").filter(function () {
            return $(this).attr("data-id") != id;
        }).removeClass("active");
        $(".item-content.hover").filter(function () {
            return $(this).attr("data-id") != id;
        }).removeClass("hover");

        //监听元素class变化，触发回调函数更新title
        let operation = $(setting).parents(".list-box").children(".file-operations");
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes") {
                    self.updateTitle(id);
                }
            });
            observer.disconnect();
        });
        if (operation.hasClass("active")) {
            operation.removeClass("active");
        } else {
            operation.addClass("active");
            //监听键盘事件更新title
            $(operation).off().on("keydown", function (e) {
                switch (e.keyCode) {
                    case 13:
                        $(self).trigger("click");
                        break;
                    default:
                        return;
                }
            });
            //监听dom变化
            let DomOperation = operation.get(0);
            let options = {
                attributes: true,
                childList: true,
                attributesFilter: ["class"]
            }
            observer.observe(DomOperation, options);
            self.dialog = new DialogFx(document.getElementById("dialog"), {
                onOpenDialog: function () {
                    $(document).trigger("click");
                },
                onCloseDialog: function () {
                    self.dialog = null;
                },
                message: contentType == "doc" ? "确定要删除此文档么?" : "确认要删除此文件夹么?<br>文件夹下的文档也将被删除。",
                confirmAction: function () {
                    let obj = {
                        url: "/Blog/DeleteBlog/",
                        data: {
                            ID: id,
                            FileType: contentType
                        },
                        success: function (result) {
                            self.render(result);
                        }
                    }
                    $.Ajaxobj(obj);
                }
            });
            self.bindDialog(operation,self.dialog);
        }
    }

    bindDialog(operation, dialog) {
        let dlgtrigger = $(operation).find(".delete");
        $(dlgtrigger).off().on("click", function () {
            dialog.toggle();
        });
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
                }
            }
            $.Ajaxobj(obj);
        }
    }

    show(id) {
        location.href = "/Blog/Edit?id=" + id;
    }
};
jQuery(document).ready(function () {
    let blog = new Bloglist();    
    blog.Init(localStorage.getItem("blogData"), localStorage.getItem("blogMode"));

    //调用blog.init方法rerender整个blog
    $(".list-crumb").on("click", ".crumb-item", function () {
        blog.Init($(this).attr("data-id"), localStorage.getItem("blogMode"));
    });
    $(".list-container").on("click", "a", function () {
        if ($(this).children().hasClass("folder-content")) {
            blog.Init($(this).attr("data-id"), localStorage.getItem("blogMode"));
        } else {
            blog.show($(this).attr("data-id"));
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

    //点击设置图标显示设置项
    $(".list-container").on("click", ".item-setting", function (e) {
        blog.setOperation(this);   
        e.stopPropagation();
    });

    //切换显示模式
    $(".list-switch").on("click", function () {
        blog.switchMode(localStorage.getItem("blogMode")==="Tile"?"List":"Tile");
    });
});