import Server from "./index";
import Request from "./Request";
import Response from "./Response";

class Router extends Server {
    basePath: string;
    constructor(basePath: string) {
        super(true);
        this.basePath = basePath
    }

    append(route: string, cb: (req: Request, res: Response) => any) {
        super.append(this.basePath + route, cb);
    }

}


export default Router;
