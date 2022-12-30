const Server = require("./main");

class Router extends Server {
    constructor(basePath) {
        console.log(typeof Router);
        super(true);
        this.basePath = basePath
    }

    append(route, cb) {
        super.append(this.basePath + route, cb);
    }

}

module.exports = Router;
