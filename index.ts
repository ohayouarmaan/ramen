const http = require("http");
const Request = require("./Request");
const Response = require("./Response");

class Server {
    constructor(isRouter, locals = {}) {
        if(!isRouter) {
            this.server = http.createServer(async (req, res) => await this.handle(req, res));
        }
        this.locals = locals;
        this.graph = {};
    }

    async handle(req, res) {
        const request = new Request(req);
        const initialized = await request.init();
        request.locals = this.locals;
        if(initialized) {
            const response = new Response(res);
            let sent = false;
            await Object.keys(this.graph).forEach(async (path) => {
                const params = await this.match(path, request._url)
                if(params && sent == false) {
                    request.addParams(params);
                    sent = true;
                    return this.graph[path](request, response); 
                }
            });
            if(!sent) {
                return this.defaultMiddleWare(request, response);
            }
        }
    }

    defaultAppend(cb) {
        this.defaultMiddleWare = cb;
    }

    append(path, cb) {
        this.graph[path] = cb;
    }

    appendRouter(router) {
        Object.keys(router.graph).forEach(route => {
            this.append(route, router.graph[route]);
        });
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
                tokens.push({q: q})
                params[q] = q;
            } else {
                tokens.push(r)
            }
        });

        for(let i = 0; i < tokens.length; i++) {
            if(typeof tokens[i] == "object" && desiredRoutes[i]) {
                const q = Object.keys(tokens[i])[0]
                params[tokens[i][q]] = desiredRoutes[i];
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