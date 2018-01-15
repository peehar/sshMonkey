require("./terminal.js")

let fs = require("fs");

const database = "./database";

let listData;
if (fs.existsSync(database)) {
    let txt = fs.readFileSync(database).toString();
    listData = JSON.parse(txt);
} else {
    listData = {
        actived: null,
        data: [
        ]
    };

    fs.writeFileSync(database, JSON.stringify(listData))
}

console.log(listData)

var tabData = {
    actived: null,
    data: []
}

let dialogData = {
    type: null,
    node: {},
    host: {},
}

new Vue({
    el: '#app',
    data() {
        return {
            listData: listData,
            tabsData: tabData,
            dialogData: dialogData
        };
    },
    computed: {
        menuitemClasses: function () {
            return [
                'menu-item',
                this.isCollapsed ? 'collapsed-menu' : ''
            ]
        }
    },
    methods: {

        onDblclickGroup: function (l1) {
            dialogData.type = "node";
            dialogData.node = listData.data[l1];
        },

        onDblclickItem: function (l1, l2) {
            dialogData.type = "host";
            dialogData.host = listData.data[l1].data[l2];
        },

        onClickSpace: function () {
            if (dialogData.type == "node" || dialogData.type == "host") {
                fs.writeFileSync(database, JSON.stringify(listData))
                dialogData.type = null;
            }
        },

        onClickExpand: function (index) {
            listData.data[index].open = !listData.data[index].open;
        },

        onClickGroup: function (index) {
            listData.actived = index;
            if (listData.data[index].data.length == 0) {
                listData.data[index].open = true;
            }
            // listData.data[index].open = !listData.data[index].open;
        },

        onClickItem: function (l1, l2) {
            listData.actived = l1 + "," + l2;
        },

        onClickTab: function (index) {
            tabData.actived = index;
        },
        onAddNode: function () {
            listData.data.push({
                name: "New Node",
                data: [],
                open: false,
            });
        },
        onAddHost: function (index, e) {
            // e.stopPropagation();
            listData.data[index].data.push({
                name: "New Host"
            });
        },

        onConnect: function (l1, l2) {
            let item = listData.data[l1].data[l2];
            tabData.actived = tabData.data.length;

            let td = {
                name: listData.data[l1].name + " - " + item.name,
                data: item,
                onClose: onClose
            }
            tabData.data.push(td)

            function onClose() {
                for (let i = 0, len = tabData.data.length; i < len; i++) {
                    let item = tabData.data[i];
                    if (item === td) {
                        tabData.data.splice(i, 1);
                        break;
                    }
                }
            }
        },

        deleteHost: function() {

        },
        deleteNode: function() {

        },

        ondragstart: function () {
            console.log("fdasfd");
        }
    }
})
