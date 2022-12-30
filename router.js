const Server = require("./main");

class Router extends Server {
    constructor(basePath) {
        super(true);
        this.basePath = basePath
    }
}

module.exports = Router;