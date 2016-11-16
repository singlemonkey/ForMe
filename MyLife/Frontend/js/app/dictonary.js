class WaterFall {
    constructor(props) {
        let defaultOption = {
            'columnWieth': 200,
        }
        this.container = $(props.container);        
        this.options = Object.assign(defaultOption, props);
        this.init();
    }

    init() {
        for (var i = 0,l=this.options.data.length; i < l; i++) {
            this.renderItem(this.options.data[i]);
        }
    }

    renderItem(dictonary) {
        let container = this.container;
        let tmpl = $.templates("#dictonariesUnit");
        let unit = tmpl.render(dictonary);
        container.append(unit);
    }

};