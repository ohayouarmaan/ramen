import "reflect-metadata";
import Server from "./server";
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

export function Post(path: string) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("method", "POST", target, propertyKey);
        Reflect.defineMetadata("path", path, target, propertyKey);
        Reflect.defineMetadata("callback", descriptor.value, target, propertyKey);
        const og = descriptor.value;
        descriptor.value = (...args: []) => {
            return og(...args);
        }
    };
};

export function Put(path: string) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("method", "PUT", target, propertyKey);
        Reflect.defineMetadata("path", path, target, propertyKey);
        Reflect.defineMetadata("callback", descriptor.value, target, propertyKey);
        const og = descriptor.value;
        descriptor.value = (...args: []) => {
            return og(...args);
        }
    };
};

export function Delete(path: string) {
    return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata("method", "DELETE", target, propertyKey);
        Reflect.defineMetadata("path", path, target, propertyKey);
        Reflect.defineMetadata("callback", descriptor.value, target, propertyKey);
        const og = descriptor.value;
        descriptor.value = (...args: []) => {
            return og(...args);
        }
    };
};

export function Use(path: string, router: object) {
    return function (target: object) {

        var currentRouter = Reflect.getMetadata("routers", target);
        if(currentRouter){
            currentRouter.push({path, router});
        } else {
            currentRouter = [
                {
                    path,
                    router
                }
            ];
        }

        Reflect.defineMetadata("routers", currentRouter, target);
    }
}

export default Router;
