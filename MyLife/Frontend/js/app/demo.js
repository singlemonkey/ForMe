class Wish{
    constructor() {
        this.wishs = wishs;
        this.init();
    }
    init() {
        this.render();
    }
    addWish(result) {
        let tmpl = $.templates("#wishs");
        let unit = tmpl.render(result);
        let readonly = false;
        $("#wishContent").append(unit);
    }
    render() {
        let wish = this.wishs;
        for (var i = 0, l = wish.length; i < l; i++) {
            let tmpl = $.templates("#wishs");
            for (var j = 0, c = wish[i].WishUnitList.length; j < c; j++) {
                let date = wish[i].WishUnitList[j].CreateDate;
                if (date.indexOf("-") == -1) {
                    wish[i].WishUnitList[j].CreateDate = $.formatDate(new Date(parseInt(date.substr(6, 13))));
                }
            }
            let unit = tmpl.render(wish[i]);
            let raty = wish[i].Raty;
            let readonly = false;
            if (wish[i].Flag != 0) {
                readonly = true;
            }
            $("#wishContent").append(unit);
            if (wish[i].Flag == -1) {
                this.setTime(wish[i].ID,wish[i].EndDate);
            }
            this.setRaty(wish[i].ID,raty,readonly);
        }        
    }
    setTime(id, date) {
        var interval=setInterval(function (id,date) {
            var EndTime = new Date(parseInt(date.substr(6, 13)));
            var NowTime = new Date();
            var t = EndTime.getTime() - NowTime.getTime();
            if (t <= 0) {
                t = 0;
                clearInterval(interval);
                $(".countdown[data-id=" + id + "]").text('');
            } else {
                var d = Math.floor(t / 1000 / 60 / 60 / 24);
                var h = Math.floor(t / 1000 / 60 / 60 % 24);
                var m = Math.floor(t / 1000 / 60 % 60);
                var s = Math.floor(t / 1000 % 60);
                $(".countdown[data-id=" + id + "]").text(d + "天" + h + "时" + d + "分" + s + "秒");
            }            
        }, 1000,id,date);
    }
    setImg(url) {
        $("#wishPic").attr("src",url);
    }
    setRaty(id, raty, readonly) {
        let self = this;
        let container = $("#wishContent div[data-id=" + id + "]");
        container.raty({
            score: raty,
            path: '../Frontend/assets/raty/lib/img/',
            readOnly: readonly
        });
    }
}
jQuery(document).ready(function () {
    let wish = new Wish();
    $(".add").on("click", function () {
        $('#addModal').modal();
    });
    $(".save").on("click", function () {
        let wishName = $("#wishName").val().trim();
        if (wishName) {
            let obj = {
                url: "/Wish/AddWish/?name=" + wishName,
                success: function (result) {
                    wish.addWish(result);
                    $("#wishName").val("");
                    $("#addModal").modal("hide");
                }
            }
            $.Ajaxobj(obj);
        }
    });
});