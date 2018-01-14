let fs = require("fs");

let template = fs.readFileSync('./template/tree.template').toString();

// define the item component
Vue.component('item', {
    template: template,
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                Vue.set(this.model, 'children', [])
                this.addChild()
                this.open = true
            }
        },
        addChild: function () {
            this.model.children.push({
                name: 'new stuff',
                edit: this.model.edit,
                ssh: this.model.ssh,
            })
        },
        edit: function(event) {
            this.model.edit(this.model);
            event.stopPropagation();

        },
        ssh: function(event) {
            this.model.ssh(this.model);
            event.stopPropagation();
        }
    }
})