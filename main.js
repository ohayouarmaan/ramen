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
            const params = await this.match(path, request._url)
            if(params) {
                request.addParams(params);
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
        const params = {};
        const routes = path.split("/");
        const desiredRoutes = desiredPath.split("/");

        if(routes.length !== desiredRoutes.length) {
            return false;
        }

        routes.forEach(r => {
            if(r.startsWith(":")) {
                const q = r.slice(1, r.length)
                tokens.push({q})
                params[q] = q;
            } else {
                tokens.push(r)
            }
        });

        for(let i = 0; i < tokens.length; i++) {
            if(typeof tokens[i] == "object" && desiredRoutes[i]) {
                const q = Object.keys(tokens[i])[0]
                tokens[i] = {q: desiredRoutes[i]}
                params[q] = desiredRoutes[i];
            } else if(typeof tokens[i] == "string" && desiredRoutes[i]) {
                if(tokens[i] !== desiredRoutes[i]){
                    return false
                }
                tokens[i] = desiredRoutes[i]
            }
        }

        return params;
    }
}

module.exports = Server;