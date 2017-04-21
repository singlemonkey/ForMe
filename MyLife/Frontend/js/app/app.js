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
 * url：服务器地址
 * pageInfo:分页信息
 * queryInfo:查询信息，初始化为null，点击查询按钮传入参数并查询。
 * callback:获取数据之后的渲染回调
 */
class Table {
    constructor(props) {
        this.pageInfo = {
            isPaging: props.isPaging || false,
            pageSize: props.rows || 8,
            pageIndex: 1
        };     
        this.url = props.url;
        this.callback = props.callback;
        this.queryInfo = null;
        this.data = null;
        this.lineHeight = 42;
        this.count =0;
        this.init();
    }

    get count() {
        return this._count;
    }
    set count(c) {
        if (c == 0) {
            this.addNullRow();
        } else {
            this.removeNullRow();
        }
        this._count = c;
    }
    //如果有只需要执行一次的函数，重写init，但要保持init的默认实现。
    init() {
        this.query();
        this.bindCheckBoxEventListener();
        this.bindPageEventListener();
    }

    query(queryInfo) {
        this.queryInfo = queryInfo;
        this.pageInfo.pageIndex = 1;
        this.getData();
    }

    getData() {
        let self = this;
        let obj = {
            url: self.url,
            data: {
                PageInfo: self.pageInfo,
                QueryInfo: self.queryInfo
            },
            success: function (result) {
                self.data = result.List;
                self.count = result.Count;
                self.renderTable();
                self.callback();
            }
        }
        $.Ajaxobj(obj);
    }


    setPage() {
        $("#page-list").empty();
        let self = this;
        let pages = Math.ceil(this.count / this.pageInfo.pageSize);
        let pageindex = this.pageInfo.pageIndex;
        let pagelist = $("<ul></ul>", {})
        for (var i = 1; i <= pages; i++) {
            let li = $("<li></li>", {
                text: i,
                "data-id": i,
                "class": i == pageindex ? "active" : "",
            })
            pagelist.append(li);
        }
        $("#page-list").append(pagelist);
        
    }    

    renderTable() {
        $("#tbody").empty();
        let self = this;
        let height = self.lineHeight * self.pageInfo.pageSize - 1;
        $("#tbody").css("max-height", height);
        for (var i = 0; i < self.data.length; i++) {
            self.renderRow(self.data[i]);
        }
        if (self.pageInfo.isPaging) {
            self.setPage();
        }
    }

    addRow(rowData) {
        //在子类中重写
        this.renderRow(rowData);
        this.count = this.count + 1;
    }

    removeRow() {
        $(".selectItem:checked").each((i, e) => {
            $(e).parents("tr").remove();
            this.count = this.count - 1;
        });
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

    bindPageEventListener() {
        let self = this;
        $(".table").on("click", "ul li", function () {
            let index = $(this).attr("data-id");
            self.pageInfo.pageIndex = index;
            self.getData();
        })
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
    //子类中重写执行回调
    callback() {
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