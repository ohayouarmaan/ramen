import Server from "./index";
import Request from "./Request";
import Response from "./Response";

class Router extends Server {
    basePath: string;
    constructor(basePath: string) {
        super(true);
        this.basePath = basePath
    }

    append(path: string, method?: string, ...cb: Array<(req: Request, res: Response, next: Function) => any>) {
        super.append(this.basePath + path, method, ...cb);
    }

}


export default Router;
