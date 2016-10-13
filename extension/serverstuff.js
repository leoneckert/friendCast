// var https = require('https-browserify');
// // var r = https.request('https://github.com');
// // r.on('request', function (res) {
// //     console.log(res);
// // });

// var options = {
//   key: fs.readFileSync('my-key.pem'),
//   cert: fs.readFileSync('my-cert.pem')
// };

// var browserify = require('browserify');

var https = require("https-browserify");
// const options = {
//   host: 'api.github.com',
//   method: 'GET',
//   withCredentials: false
// };
// https.get('https://api.github.com');


var fs = require("fs");

// var options = {
//   key: fs.readFile('my-cert.pem'),
//   cert: fs.readFile('my-key.pem')
// };

// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }).listen(8000);


// https.get('https://encrypted.google.com/', (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   res.on('data', (d) => {
//     process.stdout.write(d);
//   });

// }).on('error', (e) => {
//   console.error(e);
// });



var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

// function handleIt(req, res) {
//     var parsedUrl = url.parse(req.url);

//     var path = parsedUrl.pathname;
//     if (path == "/") {
//         path = "index.html";
//     }

//     if(req.url != "/favicon.ico"){
//         fs.readFile(__dirname + path,

//         // Callback function for reading
//         function (err, fileContents) {
//             // if there is an error
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading ' + req.url);
//             }
//             // Otherwise, send the data, the contents of the file
//             res.writeHead(200);
//             res.end(fileContents);
//         }
//     );  
    
//     // Send a log message to the console
//     console.log("Got a request " + req.url);
//     }

    
// }

var httpServer = https.createServer(options, alert("hello"));
// httpServer.listen(8080);


// const options = {
//   key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//   cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
// };

// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }).listen(8000);
