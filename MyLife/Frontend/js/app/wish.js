class wishTable extends Table {
    constructor(props) {
        super(props);
        this.tmpl = $("#tableRow");
    }

    renderRow(rowData) {
        let self = this;
        if (rowData.CreateDate != null && rowData.CreateDate.indexOf("-") == -1) {
            rowData.CreateDate = $.formatDate(new Date(parseInt(rowData.CreateDate.substr(6, 13))));
        }
        let row = self.tmpl.render(rowData);
        $("#tbody").append(row);
        if (rowData["Flag"] == -1) {
            self.setTime(rowData["ID"], rowData["EndDate"]);
        }
        self.setRaty(rowData["ID"], rowData["Degree"]);
    }

    setTime(id, date) {
        var interval = setInterval(function () {
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
                $(".timer[data-id=" + id + "]").text(d + "天" + h + "时" + m + "分" + s + "秒");
            }            
        }, 1000, id, date);
    }

    setRaty(id, raty) {
        let self = this;
        let container = $(".degree[data-id=" + id + "] div");
        container.raty({
            score: raty,
            path: '../Frontend/assets/raty/lib/img/',
            readOnly: true
        });
    }

    setTotal() {
        var total = 0;
        for (var i = 0; i < this.data.length; i++) {
            total += this.data[i]["Price"];
        }
        $("#total").text(total);
    }
}
jQuery(document).ready(function () {
    let table = new wishTable({
        rows:100,
        url: "/Wish/GetPageList",
        isPaging: true,
        callback: function () {
            this.setTotal();
        }
    });
    $(".add").on("click", function () {
        $('#addModal').modal();
    });
    $("#addModal").on("hide.bs.modal", function () {
        $(".form .input").val("");
        $("#raty").raty({
            score: 0,
        });
    });
    $(".form .input").on("keyup change", function () {
        let name = $("#wishName").val();
        let price = $("#wishPrice").val();
        let wishPurpose = $("#wishPurpose").val();
        if (name && price && wishPurpose) {
            $(".save").removeClass("disabled");
        } else {
            $(".save").addClass("disabled");
        }
    });
    $(".save").on("click", function () {
        let name = $("#wishName").val();
        let price = $("#wishPrice").val();
        let wishPurpose = $("#wishPurpose").val();
        let degree = $('#raty').raty('score') == undefined ? 0 : $('#raty').raty('score');
        var obj = {
            url: "/Wish/AddWish",
            data: {
                Name: name,
                Degree: degree,
                Info: wishPurpose,
                Price: price
            },
            success: function (result) {
                $('#addModal').modal("hide");
                table.addRow(result);
            }
        };
        $.Ajaxobj(obj);
    });
    $("#raty").raty({
        score: 0,
    });
});