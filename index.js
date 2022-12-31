const Server = require("./main");
const Router = require("./router");
const path = require("path");

const app = new Server();

/*

--- Making different routes directly on the server class

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
    res.cookies({ "x": {val: req.params.x, path: '/'}, "y": {val: req.params.y, path: '/'} });
    return res.send({ "foo": "bar 5th" });
});

app.defaultAppend((req, res) => {
    return res.send({ "error": "Not Found" }, 404);
});

*/

// Using the router class

const router = new Router("/user");

router.append("/:name", async (req, res) => {
    const user = {
        name: req.params.name
    };

    return await res.render(path.resolve(__dirname, "example.ejs"), { user });
});

app.appendRouter(router);
app.defaultAppend((req, res) => {
    res.send({
        message: 'not found.'
    }, 200)
})

app.listen(8000)
