const Server = require("./index");

class Router extends Server {
    constructor(basePath) {
        super(true);
        this.basePath = basePath
    }

    append(route, cb) {
        super.append(this.basePath + route, cb);
    }

}

module.exports = Router;
