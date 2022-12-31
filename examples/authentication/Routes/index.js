const Router = require("../../../router");
const router = new Router("/auth");
const path = require("path");
const database = [];

router.append("/", (req, res) => {
    res.render(path.resolve(__dirname, "..", "views", "index.ejs"), 200);
    if(req.method == "POST") {
        const { name, email, password } = req.body;

        database.push({ name, email, password });

    };
});

module.exports = router;
