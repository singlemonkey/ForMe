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
        this.renderContainer(data.ContainerList);
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
                let listItem = $("<li></li>", {
                    "class":"list-item"
                });
            }
        }
    }
};
jQuery(document).ready(function () {
    let blog = new Bloglist();    
    blog._init =localStorage.getItem("blogInit");
    $(".list-crumb").on("click", ".crumb-item", function () {
        blog._init = $(this).attr("data-id");
    });
});