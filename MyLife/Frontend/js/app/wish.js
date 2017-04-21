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
        if (rowData.EndDate != null && rowData.EndDate.indexOf("-") == -1) {
            rowData.EndDate = $.formatDate(new Date(parseInt(rowData.EndDate.substr(6, 13))));
        }
        let row = self.tmpl.render(rowData);
        $("#tbody").append(row);
        if (rowData["Flag"] == -1) {
            self.setTime(rowData["ID"], rowData["EndDate"]);
        }
    }

    setTime() { }

    setRaty() { }
}
jQuery(document).ready(function () {
    let table = new wishTable({
        rows:20,
        url: "/Wish/GetPageList",
        //isPaging: true
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