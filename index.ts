import http from "http";
import Request from "./Request";
import Response from "./Response";

class Server {
    server?: http.Server;
    locals: { [k:string]: string };
    graph: {method?: string | undefined; [path: string]: ((req: Request, res: Response) => any) | string | undefined};
    defaultMiddleWare?: Function;

    constructor(isRouter: boolean, locals = {}) {
        if(!isRouter) {
            this.server = http.createServer(async (req, res) => await this.handle(req, res));
        }

        this.locals = locals;
        this.graph = {};
    }

    async handle(req: http.IncomingMessage, res: http.ServerResponse) {
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
                    if(typeof this.graph[path] == "function") {
                        return (this.graph[path] as (req: Request, res: Response) => any)(request, response); 
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

    defaultAppend(cb: Function) {
        this.defaultMiddleWare = cb;
    }

    append(path: string, cb: (req: Request, res: Response) => any) {
        this.graph[path] = cb;
    }

    appendRouter(router: Server) {
        Object.keys(router.graph).forEach(route => {
            if(route != "method" && typeof route == "function") {
                this.append(route, (router.graph[route] as (req: Request, res: Response) => any));
            }
        });
    }

    listen(port: number) {
        this.server?.listen(port);
    }

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
