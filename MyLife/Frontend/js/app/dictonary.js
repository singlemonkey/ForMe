class Dictionary {
    constructor(props) {
        let defaultOption = {
            'defaultWidth': 200,
        }
        this.container = $(props.container);        
        this.options = Object.assign(defaultOption, props);
        this.dialog = null;
        this.timeout = null;
        this.init();
    }

    //初始化各项参数
    init() {
        this.container.empty();
        let width = this.container.width()-40;
        this.column = Math.floor(width / this.options.defaultWidth);
        let getColumns = () => {
            var arr = [];
            for (var i = 0, l = this.column; i < l; i++) {
                arr.push(0);
            }
            return arr;
        }
        this.columns = getColumns();
        this.columnWidth = width / this.column;
        this.render();
    }

    render() {
        let self = this;
        self.renderColumn();
        for (var i = 0, l = this.options.data.length; i < l; i++) {
            (function (i) {
                setTimeout(function () {
                    self.renderItem(self.options.data[i]);
                },600*i);
            })(i);                        
        }
        self.renderButton();
    }
    //先渲染布局列
    renderColumn() {
        let self=this;
        for (var i = 0; i < self.column; i++) {
            let column = $("<div></div>", {
                'class': 'column ',
                style: 'width:' + (self.columnWidth)+'px',
                'data-column':i
            })
            let columnUl = $("<ul></ul>");
            column.append(columnUl);
            self.container.append(column);
        }
    }
    //渲染各个字典项
    renderItem(dictonary) {
        let self=this;
        let itemContainer;
        //查找最短列
        let indexOfSamllest = () =>{
            let lowest = 0;
            const columns=self.columns;
            for (var i = 0; i < columns.length; i++) {
                if(columns[i]<columns[lowest]) lowest=i;
            }
            return lowest;
        }
        let index = indexOfSamllest();
        itemContainer = $(".column[data-column=" + index + "] > ul");
        let tmpl = $.templates("#dictonariesUnit");
        let unit = tmpl.render(dictonary);
        itemContainer.append(unit);
        //动画加载
        $("li[data-id="+dictonary.ID+"]").animate({
            "opacity":1
        },600,"swing");
        //更新各列的高度
        self.update(index);
    }
    renderButton() {
        let addButton = $("<a></a>", {
            'class': 'button button-primary',
            text: '新建',
            click: () => {
                $(".modal-title").text("请输入字典名称");
                $(".modal").attr("data-type","AddDictionary");
                $('#addModal').modal();
            }
        });
        this.container.append(addButton);
    }

    addNewDictionary(name) {
        let self = this;
        let obj = {
            showProgress: false,
            url: "/Dictionary/AddDictionary/?name="+name,
            success: function (result) {
                if (result != "") {
                    self.renderItem(result);
                }
                else {
                    self.dialog = new DialogFx(document.getElementById("dialog"), {
                        message:"已有重复的字典项"
                    });
                    self.dialog.toggle();
                }
            }
        }
        $.Ajaxobj(obj);
    }

    addNewDictionaryItem(id, name) {
        let self = this;
        let dictionaryItem = $("li[data-id=" + id + "] ul");
        let index = dictionaryItem.parents("div.column").attr("data-column");
        let obj = {
            showProgress: false,
            url: "/Dictionary/AddDictionaryItem/?id=" + id+"&name="+name,
            success: function (result) {
                if (result != "") {
                    let tmpl = $.templates("#dictonariesLiUnit");
                    let unit = tmpl.render(result);
                    dictionaryItem.append(unit);
                    self.update(index);
                }
                else {
                    self.dialog = new DialogFx(document.getElementById("dialog"), {
                        message: "已有重复的字典项"
                    });
                    self.dialog.toggle();
                }
            }
        }
        $.Ajaxobj(obj);
    }

    deleteDictionary(id) {
        let self = this;
        let dictionaryItem = $("li[data-id=" + id + "]");
        let index = dictionaryItem.parents("div.column").attr("data-column");
        let obj = {
            showProgress: false,
            url: "/Dictionary/DeleteDictionary/?id=" + id,
            success: function (result) {
                dictionaryItem.remove();
                self.update(index);
            }
        }
        $.Ajaxobj(obj);
    }

    update(index) {  
        let height = $("div[data-column="+index+"]").height();
        this.columns[index] = height;
    }
};

jQuery(document).ready(function () {
    let dictionary = new Dictionary({
        'data': dictorys,
        'container': '.container'
    });
    //页面重载
    $(window).on("resize", function () {
        location.reload();
    });

    $(".save").on("click",function () {
        $("#addModal").modal("hide");
        let name = $("#dictionaryName").val();
        let type = $(".modal").attr("data-type");
        if (name != "") {
            if (type == "AddDictionary") {
                dictionary.addNewDictionary(name);
            } else {
                let id = $(".modal").attr("data-id");
                dictionary.addNewDictionaryItem(id,name);
            }
            $("#dictionaryName").val("");
        }        
    });
    $(".container").on("click", ".delete", function () {
        let id = $(this).parents("li").attr("data-id");
        dictionary.deleteDictionary(id);
    });
    $(".container").on("click", ".add", function () {
        let id = $(this).parents("li").attr("data-id");
        let name = $("li[data-id=" + id + "] h4").text();
        $(".modal-title").text("为"+name+"添加字典项");
        $(".modal").attr("data-type", "AddDictionaryItem");
        $(".modal").attr("data-id",id);
        $('#addModal').modal();
    });
    $(".container").on("click", "a.close", function () {
        let id = $(this).parent("li").attr("data-id");
        dictionary.deleteDictionary(id);
    });
});