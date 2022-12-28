const Server = require("./main");

const app = new Server();

app.append("/", (req, res) => {
    return res.send({ "foo": "bar 1st" });
});

app.append("/foo", (req, res) => {
    return res.send({ "foo": "bar 2nd" });
});

app.append("/foo/:x", (req, res) => {
    return res.send({ "foo": "bar 3rd" });
});

app.append("/bar/:x", (req, res) => {
    return res.send({ "foo": "bar 4th" });
});

app.append("/bar/:x/:y", (req, res) => {
    console.log(req.params);
    res.cookies({ "x": req.params.x, "y": req.params.y });
    return res.send({ "foo": "bar 5th" });
});

app.defaultAppend((req, res) => {
    return res.send({ "error": "Not Found" }, 404);
});

app.listen(8000)
