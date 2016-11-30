class costTable {
    constructor(props) {
        this.month = this.getMonth();
        this.lineHeight = 41;
        this.rows = props.rows;
        this.tmpl = $("#tableRow");
        this.total = 0;
        this.count = 0;
        this.init();
    }
    init() {
        this.setMonth();
        this.render();
    }

    render() {
        let self = this;
        let height = self.lineHeight * self.rows;
        $("#tbody").css("max-height",height+self.rows-1);
        for (var i = 0; i < costs.length; i++) {
            self.addRow(costs[i]);
        }
    }

    judgeCount() {
        let self = this;
        if (self.count>self.rows) {
            $(".table.scroll thead th:last-child").css("padding-right", "23px");
        } else {
            $(".table.scroll thead th:last-child").css("padding-right", "8px");
        }
    }
    
    addRow(rowData) {
        let self = this;
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
        $("#prev").text(self.into(month - 1) + "月");
        $("#next").text(self.into(month + 1) + "月");
    }
    
    //获取当前月份
    getMonth() {
        var date = new Date;
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        return month;
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
        rows:8
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
                    table.addRow(result);
                }
            }
            $.Ajaxobj(obj);
        }
    });    
});