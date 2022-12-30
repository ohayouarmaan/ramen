const Server = require("./main");

class Router extends Server {
    constructor(basePath) {
        console.log(typeof Router);
        super(true);
        if(basePath[basePath.length - 1] == "/"){
            this.basePath = basePath
        } else {
            this.basePath = `${basePath}/`
        }
    }

    append(route, cb) {
        super.append(this.basePath + route, cb);
    }

}

module.exports = Router;
