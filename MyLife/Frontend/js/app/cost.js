class costTable {
    constructor(props) {
        this.year = this.getYear();
        this.month = this.getMonth();
        this.data = costs;
        this.callback = props.callback;
        this.lineHeight = 42;
        this.rows = props.rows;
        this.tmpl = $("#tableRow");
        this.total = 0;
        this.count = 0;
        this.init();
    }
    init() {
        this.total = 0;
        this.count = 0;
        this.setMonth();
        this.render();
    }

    search() {
        let month = this.month;
        let year = this.year;
        let queryString = $("#searchInput").val();
        let self = this;
        let obj = {
            url: "/Cost/GetCosts/?year=" + year + "&month=" + month + "&queryString=" + queryString,
            success: function (result) {
                self.data = result;
                self.init();
            }
        }
        $.Ajaxobj(obj);
    }

    render() {
        let self = this;
        if (self.data.length == 0) {
            self.addNullRow();
        } else {
            let height = self.lineHeight * self.rows-1;
            $("#tbody").css("max-height", height);
            for (var i = 0; i < self.data.length; i++) {
                self.addRow(self.data[i]);
            }
        }
        self.callback();
    }

    today() {
        this.month = this.getMonth();
        this.year = this.getYear();
        this.search();
    }

    judgeCount() {
        let self = this;
        if (self.count>self.rows) {
            $(".table.scroll thead th:last-child").css("padding-right", "23px");
        } else {
            $(".table.scroll thead th:last-child").css("padding-right", "8px");
        }
    }

    addNullRow() {
        let self = this;
        if (self.count == 0) {
            $("#tbody").empty();
        }
        let tr = $("<tr></tr>", {
            "class":"nodata"
        });
        let td = $("<td></td>", {
            text: "暂无相关数据"
        });
        tr.append(td);
        $("#tbody").append(tr);
    }
    
    addRow(rowData) {
        let self = this;
        if (self.count == 0) {
            $("#tbody").empty();
        }
        if (rowData.CostDate.indexOf("-") == -1) {
            rowData.CostDate = $.formatDate(new Date(parseInt(rowData.CostDate.substr(6, 13))));
        }
        let row = self.tmpl.render(rowData);
        $("#tbody").append(row);
        self.total += rowData.Money;
        self.count += 1;
        $("#total").html(self.total);
        self.judgeCount();
    }

    setMonth() {
        let self = this;
        let month = this.month;
        let prevMonth = month - 1;
        if (prevMonth == 0) {
            prevMonth = 12;
        }
        let nextMonth = month + 1;
        if (nextMonth == 13) {
            nextMonth = 1;
        }
        $("#prev").text(self.into(prevMonth) + "月");
        $("#next").text(self.into(nextMonth) + "月");
    }
    
    //获取当前月份
    getMonth() {
        var date = new Date;
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        return month;
    }
    getYear() {
        var date = new Date;
        var year = date.getFullYear();
        return year;
    }
    //转为为大写
    into(number) {
        switch (number) {
            case 1:
                return "一";
                break;
            case 2:
                return "二";
                break;
            case 3:
                return "三";
                break;
            case 4:
                return "四";
                break;
            case 5:
                return "五";
                break;
            case 6:
                return "六";
                break;
            case 7:
                return "七";
                break;
            case 8:
                return "八";
                break;
            case 9:
                return "九";
                break;
            case 10:
                return "十";
                break;
            case 11:
                return "十一";
                break;
            case 12:
                return "十二";
                break;
            default:
                return "零";
        }
    }
}

jQuery(document).ready(function () {
    let table = new costTable({
        rows: 8,
        callback: function () {
            let height =parseInt($("#tbody").css("max-height")) + 134;
            $(".cost-linechart").css("height", "calc(100% - " + height + "px)");
        }
    });    
    $(".actions .input").on("keyup change", function () {
        let buy = $("#buy");
        let money = $("#money").val();
        let costType = $("#costType").val();
        let payType = $("#payType").val();
        if (money && costType != -1 && payType != -1) {
            buy.removeClass("disabled");
        } else {
            buy.addClass("disabled");
        }
    });

    $("#buy").on("click", function () {
        if ($(this).hasClass("disabled")) {
            return false;
        } else {
            let buy=$(this);
            let money = $("#money").val();
            let goodName = $("#what").val();
            let desc = $("#desc").val();
            let costType = $("#costType").val();
            let payType = $("#payType").val();
            let obj = {
                url: "/Cost/AddCost/",
                data: {
                    Money: money,
                    GoodName:goodName,
                    CostType: costType,
                    PayType: payType,
                    Description:desc
                },
                success: function (result) {
                    $(".actions select").val(-1);
                    $(".actions .input:not(select)").val("");
                    buy.addClass("disabled");
                    table.today();
                    table.addRow(result);
                }
            }
            $.Ajaxobj(obj);
        }
    });

    $("#prev").on("click", function () {
        let nowMonth = table.month;
        if (nowMonth == 1) {
            table.month = 12;
            table.year -= 1;
        } else {
            table.month -= 1;
        }
        table.search();
    })
    $("#next").on("click", function () {
        let nowMonth = table.month;
        if (nowMonth == 12) {
            table.month = 1;
            table.year += 1;
        } else {
            table.month += 1;
        }
        table.search();
    })
    $("span.search").on("click", function () {
        table.search();
    });
});