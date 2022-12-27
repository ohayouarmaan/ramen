const http = require("http");
const Request = require("./Request");

class Server {
    constructor() {
        this.server = http.createServer(async (req, res) => await this.handle(req, res));
        this.graph = {};

    }

    async handle(req, res) {
        const request = new Request(req);
        const response = res;
        Object.keys(this.graph).forEach(async (path) => {
            // request.define();
            if(await this.match(path, request._url)) {
                return this.graph[path](request, response); 
            }
        });
        return this.defaultMiddleWare(request, response);
    }

    defaultAppend(cb) {
        this.defaultMiddleWare = cb;
    }

    append(path, cb) {
        this.graph[path] = cb;
    }

    listen(port) {
        this.server.listen(port);
    }

    async match(path, desiredPath) {
        const tokens = [];
        const routes = path.split("/");
        const desiredRoutes = desiredPath.split("/");

        if(routes.length !== desiredRoutes.length) {
            return false;
        }

        routes.forEach(r => {
            if(r.startsWith(":")) {
                const q = r.slice(1, r.length)
                tokens.push({q})
            } else {
                tokens.push(r)
            }
        });
        for(let i = 0; i < tokens.length; i++) {
            if(typeof tokens[i] == "object" && desiredRoutes[i]) {
                const q = Object.keys(tokens[i])[0]
                tokens[i] = {q: desiredRoutes[i]}
            } else if(typeof tokens[i] == "string" && desiredRoutes[i]) {
                if(tokens[i] !== desiredRoutes[i]){
                    return false
                }
                tokens[i] = desiredRoutes[i]
            }
        }

        return true;
    }
}

module.exports = Server;