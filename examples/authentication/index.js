const Ramen = require("../../index");
const app = new Ramen();
const router = require("./Routes/index");

app.appendRouter(router);
app.defaultAppend((req, res) => {
    return res.send({
        message: "not found."
    }, 404)
})

app.listen(8000);
