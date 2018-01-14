let fs = require("fs");

let template = fs.readFileSync('./template/list2l.html').toString();

// define the item component
Vue.component('list2l', {
    template: template,
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    methods: {
        toggle: function(index) {
            this.model.data[index].open = !this.model.data[index].open;
        }
    }
})