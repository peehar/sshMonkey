var colors = require('colors'),
    { Terminal } = require('xterm');

let fit = require("xterm/dist/addons/fit")

Terminal.applyAddon(fit);
console.log(fit)

var Client = require('ssh2').Client;

// var elementPixelsLengthRuler = document.createElement("span");
// elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
// elementPixelsLengthRuler.style.display = "inline-block";
// elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词

// function calcStringPixelsCount(str, font, fontsize) {
//     // 字符串字符个数
//     var stringCharsCount = str.length;
//     elementPixelsLengthRuler.style.fontFamily = font;
//     elementPixelsLengthRuler.style.fontSize = fontsize;  // 设置span的fontsize

//     // 添加span
//     document.body.appendChild(elementPixelsLengthRuler);
//     elementPixelsLengthRuler.innerHTML = str;
//     let width = elementPixelsLengthRuler.offsetWidth;
//     return width;
// }

Vue.component('terminal', {
    template: "<div class=\"tta\" ref=\"terminal\"></div>",
    props: {
        model: Object
    },
    mounted: function () {

        let model = this.model;

        let el = this.$refs.terminal;
        console.log(model);
        let term = new Terminal();
        term.open(el);
        term.focus();
        term.fit();

        var conn = new Client();
        conn.on('ready', function () {
            conn.shell({
                cols: term.cols,
                rows: term.rows,
            }, function (err, stream) {
                if (err) throw err;
                stream.on('data', function (chunk) {
                    let txt = chunk.toString();
                    term.write(txt);
                });
                stream.on("close", function () {
                    term.destroy();
                    if (model.onClose) {
                        model.onClose();
                    }
                })
                term.on('data', function (a) {
                    stream.write(a);
                });
            });

        }).connect({
            host: this.model.data.host,
            port: this.model.data.port,
            username: this.model.data.user,
            password: this.model.data.password
        });

    },
    methods: {
        tabClick: function (index) {
            this.model.actived = index;
        },

    }
});
