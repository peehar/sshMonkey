var colors = require('colors'),
    Terminal = require('terminal.js');
 
var terminal = new Terminal({columns: 20, rows: 2});
 
terminal.write("Terminal.js in rainbows".rainbow);
 
console.log(terminal.toString('ansi'));

// process.stdin.on('readable', function () {
//     var buf = process.stdin.read();
//     if (buf ) {
//         // console.dir(buf);
//         terminal.write(buf.toString());
//     }
// });

// setTimeout(function() {
//     terminal.write("fdsafdsafd".rainbow);
// }, 1000);

// process.stdin.pipe(terminal)