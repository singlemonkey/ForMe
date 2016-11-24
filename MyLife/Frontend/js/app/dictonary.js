class Dictionary {
    constructor(props) {
        let defaultOption = {
            'defaultWidth': 150,
        }
        this.container = $(props.container);        
        this.options = Object.assign(defaultOption, props);
        this.items = 1;
        this.init();
    }
    //初始化各项参数
    init() {
        let width = this.container.width();
        this.column = Math.round(width / this.options.defaultWidth);
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
            this.renderItem(this.options.data[i]);
        }
        self.renderButton();
    }
    //先渲染布局列
    renderColumn() {
        let self=this;
        for (var i = 0; i < self.column; i++) {
            let column = $("<div></div>", {
                'class': 'column column' + i,
                style: 'width:' + (self.columnWidth)+'px',
            })
            let columnUl = $("<ul></ul>", {
                id:'columnUl'+i,
            });
            column.append(columnUl);
            self.container.append(column);
        }
    }
    //渲染各个字典项
    renderItem(dictonary) {
        let self=this;
        let itemContainer;
        if (self.items <=self.column){
            itemContainer = $(".column" + (self.items-1) + " ul");
        } else {
            //查找最短列
            let indexOfSamllest = () =>{
                let lowest = 0;
                const columns=self.columns;
                for (var i = 0; i < columns.length; i++) {
                    if(columns[i]<columns[lowest]) lowest=i;
                }
                return lowest;
            }
            itemContainer = $(".column" + indexOfSamllest() + "> ul");
        }
        let tmpl = $.templates("#dictonariesUnit");
        let unit = tmpl.render(dictonary);
        itemContainer.append(unit);
        //更新items(已加载的字典数)和各列的高度
        self.update(self.items-1,true);        
    }

    renderButton() {
        let addButton = $("<a></a>", {
            'class': 'button button-primary',
            text: '新建',
            click: () => {
                $('#addModal').modal()
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
                self.renderItem(result);
            }
        }
        $.Ajaxobj(obj);
    }

    update(index, isNewItem) {
        if (isNewItem) {
            this.items += 1;
        }        
        let height = $(".column" + index).height();
        this.columns[index] = height;
    }
};

jQuery(document).ready(function () {
    let dictionary = new Dictionary({
        'data': dictorys,
        'container': '.container'
    });
    $(".save").on("click",function () {
        $("#addModal").modal("hide");
        let name = $("#dictionaryName").val();
        if (name != "") {
            dictionary.addNewDictionary(name);
        }        
    });
});