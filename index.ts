// Import statements
import http from "http";
import Request from "./Request";
import Response from "./Response";

class Server {
    // Initial properties
    server?: http.Server;
    locals: { [k:string]: string };
    graph: {[path: string]: {cb: (req: Request, res: Response) => any; method: string} };
    defaultMiddleWare?: (req: Request, res: Response) => any;

    constructor(isRouter: boolean, locals = {}) {
        if(!isRouter) {
            this.server = http.createServer(async (req, res) => await this.handle(req, res));
        }
        this.locals = locals;
        this.graph = {};
    }

    // handles the incoming request and response;
    async handle(req: http.IncomingMessage, res: http.ServerResponse) {
        const request = new Request(req);
        const initialized = await request.init();
        request.locals = this.locals;
        if(initialized) {
            const response = new Response(res);
            let sent = false;
            await Object.keys(this.graph).forEach(async (path) => {
                const params = await this.match(path, request._url)
                if(sent == false) {
                    request.addParams(params || {});
                    sent = true;
                    if(request.method == this.graph[path]['method']) {
                        return (this.graph[path]['cb'])(request, response); 
                    } else {
                        if(this.defaultMiddleWare) {
                            this.defaultMiddleWare(request, response);
                        } else {
                            throw new Error('No default middleware given.')
                        }
                    }
                }
            });

            if(!sent) {
                if(this.defaultMiddleWare){
                    return this.defaultMiddleWare(request, response);
                } else {
                    throw new Error("No default middleware provided");
                }
            }
        }
    }

    defaultAppend(cb: (req: Request, res: Response) => any) {
        this.defaultMiddleWare = cb;
    }

    append(path: string, cb: (req: Request, res: Response) => any, method: string = "GET") {
        this.graph[path] = {
            cb: cb,
            method: method,
        };
    }

    appendRouter(router: Server) {
        Object.keys(router.graph).forEach(route => {
            if(route != "method" && typeof route == "function") {
                this.append(route, (router.graph[route]['cb']), router.graph[route]['method']);
            }
        });
    }

    listen(port: number, cb: (port: number) => void = (port: number) => {
        console.log(`SERVER RUNNING on port : ${port}`);
    }) {
        this.server?.listen(port, () => {
            cb(port);
        });
    };

    async match(path: string, desiredPath: string) {
        const tokens: Array<{
            [q: string]: string;
        } | string> = [];
        const params: { [k:string]: string } = {};
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
                const q: string = Object.keys(tokens[i])[0]
                if(typeof tokens[i] == "object"){
                    params[(tokens[i] as {[q: string]: string})[q]] = desiredRoutes[i];
                }
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

export default Server;
