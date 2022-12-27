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
    return res.end();
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

app.append("/bar/:x/:y", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working barx foox!');
    res.end();
});

app.defaultAppend((req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('Not Found');
    res.end();

});

app.listen(8000)
