const Server = require("./main");

const app = new Server();

app.append("/", (req, res) => {
    console.log(req);
    console.log(res);
});

app.listen(8000)
