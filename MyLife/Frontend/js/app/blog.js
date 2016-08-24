class Bloglist {

    constructor() {
        this.init=0
    }

    getData(id) {
        let obj = {
            url: "/Blog/BlogList/?id="+id,
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                $("html").html(error.responseText);
            }
        }
        $.Ajaxobj(obj);
    }

    render() {
        let data = this.getData(this.init);
    }

    renderCrumb() {

    }

    renderContainer() {

    }
};
jQuery(document).ready(function () {
    let blog = new Bloglist();
    blog.render();
});