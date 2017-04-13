jQuery(document).ready(function () {
    
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
            }
        };
        $.Ajaxobj(obj);
    });
    $("#raty").raty({
        score: 0,
    });
});