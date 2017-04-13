class Table {
    constructor(props) {
        this.rows = props.rows;
        this.lineHieght = 42;
        this.data = SyncStates;
        this.tmpl = $("#tableRow");
        this.count = SyncStates.length;
        this.render();
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

    render() {
        let self = this;
        let height = self.lineHieght * self.rows - 1;
        $("#tbody").css("max-height", height);
        if (self.data.length == 0) {
            self.addNullRow();
        } else {
            for (var i = 0; i < self.data.length; i++) {
                self.addRow(self.data[i]);
            }
        }
    }

    addNullRow() {
        let self = this;
        if (self.count == 0) {
            $("#tbody").empty();
        }
        let tr = $("<tr></tr>", {
            "ID":"NullRow",
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

    addRow(rowData) {
        let self = this;
        if (rowData.SyncDate != null && rowData.SyncDate.indexOf("-") == -1 ) {
            rowData.SyncDate = $.formatDate(new Date(parseInt(rowData.SyncDate.substr(6, 13))));
        }
        let row = self.tmpl.render(rowData);
        $("#tbody").append(row);
        this.count = this.count + 1;
    }

    removeRow() {
        $(".selectItem:checked").each((i, e) => {
            $(e).parents("tr").remove();
            this.count = this.count - 1;
        });
    }
}
jQuery(document).ready(function () {
    let table = new Table({
        rows:10,
    });

    $("#OpenModal").on("click", function () {
        $('#addModal').modal();
    });
    $("#addModal").on("hide.bs.modal", function () {
        $(".form .input:not(select)").val("");
        $(".form select").val("-1");
        $(".save").addClass("disabled");
    });
    $(".form .input").on("keyup change", function () {
        let tableName = $("#TableName").val();
        let isSync = $("#IsSync").val();
        let desc = $("#Desc").val();
        if (tableName && isSync!=-1 && desc) {
            $(".save").removeClass("disabled");
        } else {
            $(".save").addClass("disabled");
        }
    });
    $(".save").on("click", function () {
        let tableName = $("#TableName").val();
        let isSync = $("#IsSync").val();
        let desc = $("#Desc").val();
        var obj = {
            url: "/SyncState/AddSyncState",
            data: {
                TableName: tableName,
                IsSync: isSync,
                Desc: desc,
            },
            success: function (result) {
                $('#addModal').modal("hide");
                table.addRow(result);
            }
        };
        $.Ajaxobj(obj);
    });
    $(".table").on("change", "input[type='checkbox']", function () {
        if ($(".selectItem:checked").length == 0) {
            $("#RemoveState").attr("disabled", true);
        } else {
            $("#RemoveState").attr("disabled", false);
        }
    });
    $("#RemoveState").on("click", function () {
        let stateList = [];
        $(".selectItem:checked").each((i, e) => {
            stateList.push($(e).attr("data-id"));
        });
        var obj = {
            url: "/SyncState/RemoveSyncState",
            data: {
                stateList: stateList
            },
            success: function (result) {
                table.removeRow();
                $("#RemoveState").attr("disabled", true);
                $(".table .selectAll").prop("checked", false);
            }
        };
        $.Ajaxobj(obj);
    });
});