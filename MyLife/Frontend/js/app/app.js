class moveHeader {
    constructor(e) {
        this.isMoving = true;
        this.element = $(e);
        this.container = $(e).parent();
        this.direction = "right";
        this.width = $(e).innerWidth();
        this.timer = null;
        this.speed=1;
        this.distance = 1;
    }

    init() {
        let self = this;
        self.start();
        $(window).resize(function () {
        });
    }


    change() {
        if (this.isMoving == false) {
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        this.start();
    }

    start() {
        if (this.isMoving == false) {
            return false;
        }
        let self = this;
        let left = self.element.position().left;
        if (self.direction === "right") {
            self.element.animate({
                left: left + self.distance
            }, self.speed, "linear", function () {
                if (left + self.distance + self.width >= self.container.width()) {
                    self.direction = "left";
                }
                self.start();
            })
        } else {
            self.element.animate({
                left: left- self.distance
            }, self.speed, "linear", function () {
                if (left-self.distance <= 0) {
                    self.direction = "right";
                }
                self.start();
            })
        }
    }
}

$(function () {
    jQuery.extend({
        Ajaxobj: function (config) {
            let defaultConfig= {
                showProgress: true
            };
            let obj = Object.assign(defaultConfig, config);
            $.ajax({
                type: "POST",
                url: obj.url,
                data: JSON.stringify(obj.data),
                dataType: 'json',
                contentType: "application/json",
                global:obj.showProgress?true:false,
                success: function (result) {
                    obj.success(result);
                },
                error: function (error) {
                    $("html").html(error.responseText);
                }
            });
        },
        //$.formatDate(new Date(parseInt(item.CreateDate.substr(6, 13))));
        formatDate: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            if (h != "00" || minute != "00") {
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
            } else {
                return y + '-' + m + '-' + d;
            }
        },
        //$.JsonFromatDate($(this).val())
        JsonFromatDate: function (date) {
            var regEx = new RegExp("\\-", "gi");
            date = date.replace(regEx, "/");
            var NewDate = new Date(date);
            var i = NewDate.getTime();
            var dateString = "\/Date(" + (i + 8 * 60 * 60 * 1000) + ")\/";
            return dateString;
        },
    });
    //注册全局ajax事件，
    //在发起请求时可传入showProgress为false更改ajax的global参数来禁用此事件
    $(document).ajaxStart(() => {
        NProgress.start();
    });
    $(document).ajaxComplete(() => {
        NProgress.done();
    });
    let move = new moveHeader(".move");
    move.init();
    //移动标题初始化
    $(".move").on("click", function () {
        move.change();
    });
});