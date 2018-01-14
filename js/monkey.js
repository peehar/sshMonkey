require("./terminal.js")

let fs = require("fs");

let listData;
if (fs.existsSync("./database")) {
    listData = fs.readFileSync('./database').toString();
} else {
    listData = {
        actived: null,
        data: [{
            name: "新节点",
            open: false,
            data: [
                { name: "asfdsa", host: "192.168.0.100", port: 22, user: "pi", password: "wty17962831" },
                { name: "aaaaa" }
            ]
        }]
    };
}

console.log(listData)

var tabData = {
    actived: null,
    data: []
}

new Vue({
    el: '#app',
    data() {
        return {
            listData: listData,
            tabsData: tabData
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
        onClickGroup: function (index) {
            listData.data[index].open = !listData.data[index].open;
        },
        onClickitem: function (l1, l2) {
            let item = listData.data[l1].data[l2];
            tabData.actived = tabData.data.length;

            let td = {
                name: item.name,
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
        onClickTab: function (index) {
            tabData.actived = index;
        }
    }
})

// // boot up the demo
// var demo = new Vue({
//     el: '#app',
//     data: {
//         listData: listData,
//         tabsData: tabData
//     },
//     methods: {
//         menuClick: function(i1, i2) {
//             let item = listData.data[i1].data[i2];
//             tabData.list.push({
//                 name: item.name
//             })
//         },
//         onTabClick: function() {
//             console.log("fdsfdsafdsafdsafdsaf")




//         }
//     }
// })




// // setTimeout(() => {
//     setTimeout(() => {
//         let term = new Terminal();
//         term.open(el);

//         term.resize(80, 50);

//         term.write("fdsafdasfd")
//     }, 1000);