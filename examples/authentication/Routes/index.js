const Router = require("../../../router");
const router = new Router("/auth");
const path = require("path");
const database = [];

router.append("/", (req, res) => {
    if(req.method == "POST") {
        const { name, email, password } = req.body;
        database.push({ name, email, password });
        return res.send(`<h1>User ${name}.</h1>`);
    };

    return res.render(path.resolve(__dirname, "..", "views", "index.ejs"), {});
});

function hash(value) {
    // perform hash
    return value;
}

router.append("/signin", async (req, res) => {
    if(req.method == "POST") {
        const {email, password} = req.body;
        const foundUser = database.find(user => user.email == email);
        if(foundUser && foundUser.password == password) {
            res.cookies({ user: {val: hash(foundUser.name), path: '/'} });
            return res.send("User signed in.");
        } else {
            return res.send("Wrong password")
        }
    }

    return res.render(path.resolve(__dirname, "..", "views", "signin.ejs"), {})
});

router.append("/test", async (req, res) => {
    if(Object.keys(req.cookies).includes('user')) {
        //verify token got from the client / cookie
        if(req.cookies.user){
            return res.send(`<h1>Hello, ${req.cookies.user}</h1>`)
        }
    }
});

module.exports = router;
