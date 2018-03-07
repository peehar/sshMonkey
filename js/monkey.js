let fs = require("fs");
let { Terminal } = require('xterm');
let fit = require("xterm/dist/addons/fit") 
var Client = require('ssh2').Client;
const database = "./database";

Terminal.applyAddon(fit); 

let listData = { actived: null, data: [] };
let termPlanel = { data:[], actived: null };
let dialogData = { type: null, node: {}, host: {}, func: null }

window.windowResize = function(a) {
    // termPlanel.data.
    for (let i = 0; i < termPlanel.data.length; i++) {
        let p = termPlanel.data[i];
        p.term.fit();
        if (p.channel) {
            p.channel.setWindow(p.term.rows, p.term.cols);
        }
    }
}

window.onload = function () {

    if (fs.existsSync(database)) {
        let txt = fs.readFileSync(database).toString();
        listData = JSON.parse(txt);
    } else {
        fs.writeFileSync(database, JSON.stringify(listData))
    }

    new Vue({
        el: '#app',
        data() {
            return {
                listData: listData,
                termPlanel: termPlanel,
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
                dialogData.host = {};
            },

            onDblclickItem: function (host, node) {
                dialogData.type = "host";
                dialogData.node = node;
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

            // onClickGroup: function (node) {
            //     listData.actived = node;
            //     if (node.data.length == 0) {
            //         node.open = true;
            //     }
            // },

            onClickItem: function (host, node) {
                listData.actived = host;
            },

            onClickTab: function (index) {
                showTerminal(index);
            },

            onAddNode: function (index) {
                if (index !== undefined) {
                    listData.data.splice(index, 0, {
                        name: "New Node",
                        data: [],
                        open: false,
                    })
                } else {
                    listData.data.push({
                        name: "New Node",
                        data: [],
                        open: false,
                    });
                }
            },

            onAddHost: function (node, index) {
                if (index !== undefined) {
                    node.data.splice(index, 0, {
                        name: "New Host"
                    }) 
                } else {
                    node.data.push({
                        name: "New Host"
                    });
                }
            },

            onConnect: function (host, node) {
                openTerminal(host, node);
            },

            onTabClose: function(index) {
                let item = termPlanel.data[index];
                closeTermianl(item);
            },

            deleteHost: function () {
                let node = dialogData.node;
                let host = dialogData.host;
                dialogData.type = "confirm";
                dialogData.func = function() {
                    for (let i = 0, len = node.data.length; i < len; i++) {
                        if (node.data[i] == host) {
                            node.data.splice(i, 1);
                            break;
                        }
                    }
                }
            },

            deleteNode: function () {
                let node = dialogData.node;
                dialogData.type = "confirm";
                dialogData.func = function() {
                    for (let i = 0, len = listData.data.length; i < len; i++) {
                        if (listData.data[i] == node) {
                            listData.data.splice(i, 1);
                            break;
                        }
                    }
                }
            },

            confirmYes: function() {
                dialogData.func();
                dialogData.type = null;
                dialogData.func = null;
                fs.writeFileSync(database, JSON.stringify(listData))
            },

            confirmNo: function() {
                dialogData.type = null;
                dialogData.func = null;
            },

            ondragstart: function () {
                console.log("fdasfd");
            }
        }
    });

    function openTerminal(host, node) {

        let panel = document.getElementById("termianl");
        var el = document.createElement("div");
        // el.style.display = "none";
        el.classList.add("term")
        // el.style.width = "100%";
        // el.style.height = "100%";
        panel.appendChild(el);

        let term = new Terminal();
        term.open(el);
        term.focus();
        term.fit();

        var conn = new Client();

        let item = {
            name: node.name + " - " + host.name,
            el: el,
            term: term,
            conn: conn,
            channel: null
        }
        termPlanel.data.push(item);

        let len = termPlanel.data.length;

        showTerminal(len - 1);

        conn.on('ready', function () {

            conn.shell({
                cols: term.cols,
                rows: term.rows,
            }, function (err, stream) {
                if (!err) {
                    stream.on('data', function (chunk) {
                        let txt = chunk.toString();
                        term.write(txt);
                    });
                    stream.on("close", function () {
                        closeTermianl(item);
                    })
                    term.on('data', function (a) {
                        stream.write(a);
                    });
                    item.channel = stream;
                    
                } else {

                }
            });

        }).connect({
            host: host.host,
            port: host.port,
            username: host.user,
            password: host.password
        });
    }

    function showTerminal(index) {
        termPlanel.actived = index;
        for (let i = 0; i < termPlanel.data.length; i++) {
            let p = termPlanel.data[i];
            if (i == index) {
                p.el.style.display = "block";
                setTimeout(() => {
                    p.term.fit();
                    p.channel.setWindow(p.term.rows, p.term.cols);
                    p.term.focus();
                }, 0);
            } else {
                p.el.style.display = "none";
            }
        }
    }

    function closeTermianl(data) {
        for (let i = 0, len = termPlanel.data.length; i < len; i++) {
            if (termPlanel.data[i] == data) {
                termPlanel.data.splice(i, 1);
                if (i < len - 1) {
                    showTerminal(i);
                } else if (i > 0) {
                    showTerminal(i - 1);
                } else {
                    showTerminal(null);
                }
                break;
            }
        }
        data.term.destroy();
        data.el.parentElement.removeChild(data.el);
    }

}