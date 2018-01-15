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

        onDblclickGroup: function (node) {
            dialogData.type = "node";
            dialogData.node = node;
        },

        onDblclickItem: function (host, node) {
            dialogData.type = "host";
            dialogData.host = host;
        },

        onClickSpace: function () {
            if (dialogData.type == "node" || dialogData.type == "host") {
                fs.writeFileSync(database, JSON.stringify(listData))
                dialogData.type = null;
            }
        },

        onClickExpand: function (node) {
            node.open = !node.open;
        },

        onClickGroup: function (node) {
            listData.actived = node;
            if (node.data.length == 0) {
                node.open = true;
            }
        },

        onClickItem: function (host, node) {
            listData.actived = host;
        },

        onClickTab: function (data) {
            tabData.actived = data;
        },

        onAddNode: function () {
            listData.data.push({
                name: "New Node",
                data: [],
                open: false,
            });
        },

        onAddHost: function (node) {
            node.data.push({
                name: "New Host"
            });
        },

        onConnect: function (host, node) {
            let td = {
                name: node.name + " - " + host.name,
                host: host,
                onClose: onClose
            }
            tabData.data.push(td)
            tabData.actived = td;

            function onClose() {
                for (let i = 0, len = tabData.data.length; i < len; i++) {
                    let item = tabData.data[i];
                    if (item === td) {
                        if (i < len - 1) {
                            tabData.actived = tabData.data[i + 1];
                        } else if (i > 0) {
                            tabData.actived = tabData.data[i - 1];
                        } else {
                            tabData.actived = null;
                        }
                        tabData.data.splice(i, 1);
                        console.log(i)
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
