const Router = require("../../../router");
const router = new Router("/auth");
const path = require("path");

router.append("/", (req, res) => {
    res.render(path.resolve(__dirname, "..", "views", "index.ejs"), 200);
    if(req.method == "POST") {
        res.send(req.body, 200);
    }
});

module.exports = router;
