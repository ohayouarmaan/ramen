const http = require("http");
const Request = require("./Request");

class Server {
    constructor() {
        this.server = http.createServer((req, res) => this.handle(req, res));
        this.graph = {};

    }

    handle(req, res) {
        Object.keys(this.graph).forEach(path => {
            const request = new Request(req);
            request.define();
            const response = res;
            if(this.match(path, request._url)) {
                this.graph[path](request, response);
            }
        });
    }

    append(path, cb) {
        this.graph[path] = cb;
    }

    listen(port) {
        this.server.listen(port);
    }

    match(path, desiredPath) {
        return path == desiredPath;
    }
}

module.exports = Server;