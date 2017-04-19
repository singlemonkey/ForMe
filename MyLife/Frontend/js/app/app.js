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
        if (this.element.length!=0) {
            self.start();
        }        
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
                left: left - self.distance
            }, self.speed, "linear", function () {
                if (left-self.distance <= 0) {
                    self.direction = "right";
                }
                self.start();
            })
        }
    }
}
/**
 * table类参数说明
 * tmpl：表格行模板，必传项
 * url：服务器地址
 * rows:行数，必填项
 * isPaging:是否分也，默认为不分
 */
class Table {
    constructor(props) {
        this.rows = props.rows || 8;
        this.isPaging = props.isPaging || false;
        this.url = props.url;
        this.data = null;
        this.tmpl = props.tmpl;
        this.lineHeight = 42;
        this.count =0;
        this.init();
    }

    get count() {
        if (this._count == 0) {
            this.removeNullRow();
        }
        return this._count;
    }
    set count(c) {
        if (c == 0) {
            this.addNullRow();
        }
        this._count = c;
    }

    init() {
        this.show();
        this.bindCheckBoxEventListener();
    }

    bindCheckBoxEventListener() {
        //表格全选事件
        $(".table .selectAll").on("click", function () {
            let checked = $(this).prop("checked");
            $(".table .selectItem").prop("checked", checked);

        });
        $(".table").on("click", ".selectItem", function () {
            let flag = true;
            $(".table .selectItem").each((i, e) => {
                let checked = $(e).prop("checked");
                if (checked) {
                    return true;
                } else {
                    flag = false;
                    return flag;
                }
            });
            $(".table .selectAll").prop("checked", flag);
        });
    }

    addNullRow() {
        let self = this;
        if (self.count == 0) {
            $("#tbody").empty();
        }
        let tr = $("<tr></tr>", {
            "ID": "NullRow",
            "class": "nodata"
        });
        let td = $("<td></td>", {
            text: "暂无相关数据"
        });
        tr.append(td);
        $("#tbody").append(tr);
    }
    removeNullRow() {
        $("#NullRow").remove();
    }
}

$(function () {
    //扩展jquery本身方法
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
        getYear: function () {
            var date = new Date;
            var year = date.getFullYear();
            return year;
        },
        getMonth: function () {
            var date = new Date;
            var month = date.getMonth() + 1;
            month = (month < 10 ? "0" + month : month);
            return month;
        }
    });
    jQuery.fn.extend({
        bindDictionary: function (dictionary) {
            let self = $(this);
            let obj = {
                showProgress: false,
                url: "/Dictionary/GetDictionary/?dictionary=" + dictionary,
                success: function (result) {
                    let option = $("<option></option>", {
                        text: "请选择",
                        value:-1
                    });
                    self.append(option);
                    for (var i = 0; i < result.length; i++) {
                        let newOption = $("<option></option>", {
                            value: result[i].ID,
                            text:result[i].Name
                        })
                        self.append(newOption);
                    }
                }
            }
            $.Ajaxobj(obj);
        },
    });

    
    
});
//和Dom有关的代码写在jQuery(document).ready()事件中
jQuery(document).ready(function () {
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
    //绑定字典
    $("select[data-dictionary]").each((e) => {
        let select = $("select[data-dictionary]")[e];
        let dictionary = $(select).attr("data-dictionary");
        $(select).bindDictionary(dictionary);
    });
    
});