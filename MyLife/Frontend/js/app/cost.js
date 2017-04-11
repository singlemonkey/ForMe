class costTable {
    constructor(props) {
        this.year = $.getYear();
        this.month =parseInt( $.getMonth());
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
        let height = self.lineHeight * self.rows - 1;
        $("#tbody").css("max-height", height);
        $(".cost-table").css("height", height + 134);
        if (self.data.length == 0) {
            self.addNullRow();
        } else {           
            for (var i = 0; i < self.data.length; i++) {
                self.addRow(self.data[i]);
            }
        }
        self.callback();
    }

    today() {
        this.month =parseInt($.getMonth());
        this.year = $.getYear();
        this.search();
    }

    judgeCount() {
        let self = this;
        if (self.count>self.rows) {
            $(".table.scroll tbody tr td:last-child").css("width", "57px");
        } else {
            $(".table.scroll tbody tr td:last-child").css("width", "80px");
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

class costLineChart {
    constructor(props) {
        this.year = $.getYear();
        this.data = costsLineData;
        this.init();
    }

    init() {
        let self = this;
        self.render();
    }

    search() {
        let self=this;
        let year=self.year;
        let obj = {
            url: "/Cost/LineChart/?year=" + year,
            success: function (result) {
                self.data =result ;
                self.render();
            }
        }
        $.Ajaxobj(obj);
    }

    render() {
        let self = this;
        let year = self.year;
        let data = self.data;
        Highcharts.chart('cost-linechart', {
            chart: {
                type: 'line'
            },
            title: {
                text:year+ '年财务支出状况图'
            },
            subtitle: {
                text: '来源:'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Cost Money'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series:data
        });
    }
}

class costPieChart{
    constructor() {
        this.costData = costPercentage;
        this.payData = payPercentage;
        this.init();
    }
    init() {
        this.renderCost();
        this.renderPay();
    }

    search() {
        let self = this;
        let obj = {
            url: "/Cost/PieChart/",
            success: function (result) {
                self.costData = result["CostData"];
                self.payData = result["PayData"];
                self.init();
            }
        }
        $.Ajaxobj(obj);
    }
    renderCost() {
        let self = this;
        let data=self.costData;
        let arr = [];
        for (var i = 0; i < data.length; i++) {
            let category = [];
            category[0] = data[i].name;
            category[1] = data[i].Percentage;
            arr.push(category);
        }
        $('#pieCostTypeChart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '消费类型统计图'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '花销占比',
                data:arr
            }]
        });
    }
    renderPay() {
        let self = this;
        let data = self.payData;
        let arr = [];
        for (var i = 0; i < data.length; i++) {
            let category = [];
            category[0] = data[i].name;
            category[1] = data[i].Percentage;
            arr.push(category);
        }
        $('#piePayTypeChart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '支付类型统计图'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    showInLegend: true,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '花销占比',
                data: arr
            }]
        });
    }
}

jQuery(document).ready(function () {
    let table = new costTable({
        rows: 8,
        callback: function () {
            let height = parseInt($(".cost-table").css("height"));
            $(".cost-linechart").css("height", "calc(100% - " + height + "px)");
        }
    });
    let lineChart = new costLineChart();
    let pieChart = new costPieChart();
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
                    //折线图和饼图更新
                    lineChart.year = table.year;
                    lineChart.search();
                    pieChart.search();
                }
            }
            $.Ajaxobj(obj);
        }
    });

    $("#prev").on("click", function () {
        let nowMonth = table.month;
        if (nowMonth == 1) {
            //table加载数据
            table.month = 12;
            table.year -= 1;
            //出现跨年情况，linechart重新加载
            lineChart.year -= 1;
            lineChart.search();
        } else {
            table.month -= 1;
        }
        table.search();
    })
    $("#next").on("click", function () {
        let nowMonth = table.month;
        if (nowMonth == 12) {
            //table加载数据
            table.month = 1;
            table.year += 1;
            //出现跨年情况，linechart重新加载
            lineChart.year += 1;
            lineChart.search();
        } else {
            table.month += 1;
        }
        table.search();
    })
    $("span.search").on("click", function () {
        table.search();
    });
});