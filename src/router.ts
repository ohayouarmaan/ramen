import "reflect-metadata";
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

// Create a decorator based router
export function Route(basePath: string) {
    return function (target: object) {
        Reflect.defineMetadata("bp", basePath, target);
        const nr = new Router(basePath);
        Reflect.defineMetadata("router", nr, target);
    }
}

export function Get(path: string) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("method", "GET", target, propertyKey);
        Reflect.defineMetadata("path", path, target, propertyKey);
        Reflect.defineMetadata("callback", descriptor.value, target, propertyKey);
        const og = descriptor.value;
        descriptor.value = (...args: []) => {
            return og(...args);
        }
    };
};

export default Router;
