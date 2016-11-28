jQuery(document).ready(function () {
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
                    $(".actions input").val("");
                }
            }
            $.Ajaxobj(obj);
        }
    });
});