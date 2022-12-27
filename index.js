const Server = require("./main");

const app = new Server();

app.append("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working!');
    res.end();
});

app.append("/foo", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working foo!');
    res.end();
});

app.append("/foo/:x", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working foox!');
    res.end();
});

app.append("/bar/:x", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working barx!');
    res.end();
});

app.listen(8000)
