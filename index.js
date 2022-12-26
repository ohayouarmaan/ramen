const http = require("http");
const Request = require("./Request");

const server = http.createServer((req, res) => {
    console.log(req.url);
    const request = new Request(req);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');
    res.end();
});

server.listen(8000)
