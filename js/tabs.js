let fs = require("fs");
let template = fs.readFileSync('./template/tabs.template').toString();

var colors = require('colors'),
Terminal = require('terminal.js');


var Client = require('ssh2').Client;

var elementPixelsLengthRuler = document.createElement("span");

function calcStringPixelsCount(str, font, fontsize) {
    // 字符串字符个数
    var stringCharsCount = str.length;

    // 字符串像素个数
    // var stringPixelsCount = 0;

    // JS 创建HTML元素：span

    elementPixelsLengthRuler.style.fontFamily = font;
    elementPixelsLengthRuler.style.fontSize = fontsize;  // 设置span的fontsize
    elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
    elementPixelsLengthRuler.style.display = "inline-block";
    elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词

    // 添加span
    document.body.appendChild(elementPixelsLengthRuler);

    elementPixelsLengthRuler.innerHTML = str;
    let width = elementPixelsLengthRuler.offsetWidth;
    return width;

    // for (var i =0; i < stringCharsCount; i++) {
    //     // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
    //     // 1）span计算单个空格字符（ ），其像素长度为0
    //     // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
    //     if (str[i] == " ") {
    //         elementPixelsLengthRuler.innerHTML = "&nbsp;";
    //     } else {
    //         elementPixelsLengthRuler.innerHTML = str[i];
    //     }

    //     stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
    // }

    // return stringPixelsCount;
}


Vue.component('tabs', {
    template: template,
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    watch: {
        "model.list": function (data, val) {
            console.log(data);
            console.log(val);

            for (let i = 0; i < data.length; i++) {
                let n = data[i];
                if (n.type == "ssh" && !n.terminal) {

                    
                    this.$nextTick(function() {
                        let panel = this.$refs["terminalPanel"][0];
                        let width = 800;//panel.offsetWidth
                        let size = Math.ceil(calcStringPixelsCount("测试测试测试测试测试", "Courier, monospace", "12px") / 20);

                        let cols = Math.floor(width / size);

                        var terminal = new Terminal({ columns: cols, rows: 30 });


                        let el = this.$refs["terminal"][0];
                        var conn = new Client();
                        conn.on('ready', function () {
                            console.log('Client :: ready');
                            conn.shell({
                                cols: cols,
                                rows: 30
                            },function (err, stream) {
                                if (err) throw err;
                                stream.pipe(terminal).dom(el).pipe(stream);
                            });

                        }).connect({
                            host: '192.168.0.100',
                            port: 22,
                            username: 'pi',
                            password: 'wty17962831'
                            // privateKey: require('fs').readFileSync('/here/is/my/key')
                        });

                        n.terminal = terminal;

                    })

                }
            }

            console.log(data);

            // console.log(this.$refs.terminal)

        },
    },
    methods: {
        tabClick: function (index) {
            this.model.actived = index;
        }
    }
});
