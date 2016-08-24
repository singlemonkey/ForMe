﻿$(function () {
    jQuery.extend({
        Ajaxobj: function (config) {
            let defaultObj = {
                showProgress: true
            };
            let obj = Object.assign(defaultObj, config);
            if (obj.showProgress) {
                $(document).ajaxStart(() => {
                    NProgress.start();
                });
                $(document).ajaxComplete(() => {
                    NProgress.done();
                });
            }
            $.ajax({
                type: "POST",
                url: obj.url,
                data: JSON.stringify(obj.data),
                success: function (result) {
                    obj.success(result);
                },
                error: function (error) {
                    obj.error(error);
                }
            });
        },
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
        JsonFromatDate: function (date) {
            var regEx = new RegExp("\\-", "gi");
            date = date.replace(regEx, "/");
            var NewDate = new Date(date);
            var i = NewDate.getTime();
            var dateString = "\/Date(" + (i + 8 * 60 * 60 * 1000) + ")\/";
            return dateString;
        },
    });
});