const Server = require("./main");

const app = new Server();

app.append("/", (req, res) => {

});

app.listen(8000)
