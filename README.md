# Ramen - A micro framework for creating REST API in Nodejs
![Ramen image i got from google lol](https://res.cloudinary.com/practicaldev/image/fetch/s--QGRMnu9Q--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nfg8h1baize3kntwatl5.png)

Just another ✨Backend API Framework✨ for typescript
## The plan
Currently it's just me trying to create a javascript framework for making APIs. This is definitely inspired from the Express framework

the `Server` class in `main.js` file can be initialized which will create an HTTP server and you can use the listen function to listen to a specific port

the `Request` class in the `Request.js` file holds the request object which can be used to access all the properties for the http request.

### Installation
```bash
npm install raments
```

### How to use Ramen

1. Using the annotations syntax
```typescript
import Ramen, {Request, Response} from "raments"
import { Route, Get } from "raments/dist/src/router"; 

const ramen = new Ramen();

@Route("/posts")
class PostRouter {
    @Get("/:id")
    fetchPostWithId(req: Request<{id: string}>, res: Response) {
        const postId = req.params.id;
        const post: object = fetchPost(postId);
        return res.send(post);
    }
}

ramen.appendRouter("/api", PostRouter);

ramen.listen(process.env.PORT || 3000, (_port) => {
    console.log(`[SERVER]: Running on port ${_port}`);
});
```
2. Using the Router API
```typescript
import Ramen, {Request, Response} from "raments";
import Router from "raments/dist/src/router";

const ramen = new Ramen();
const postRouter = Router("/posts");

postRouter.append("/:id", "GET", (req: Request<{id: string}>, res: Response) => {
    const postId = req.params.id;
    const post: object = fetchPostById(postId);
    return res.send(post);
});

ramen.appendRouter("/posts", postRouter);
ramen.listen(process.env.PORT || 3000, (_port) => {
    console.log(`[SERVER]: Running on port ${_port}`);
});
```

3. or you can simply add methods in the ramen object directly!
```typescript
import Ramen from "raments";
import Request from "raments/dist/src/Request";
import Response from "raments/dist/src/Response";

const ramen = new Ramen();

ramen.append("/posts/:id", "GET", (req: Request, res: Response) => {
    const postId = req.params.id;
    const post: object = fetchPostById(postId);
    return res.send(post);
});

ramen.listen(process.env.PORT || 3000, (_port) => {
    console.log(`[SERVER]: Running on port ${_port}`);
});

```

* Request is a generic class with this definition
    ```typescript
    class Request<RouteParameters = {[key: string]: string}, Body = {[key: string]: string}, QueryParams = {[key: string]: string}>
    ```
    this helps you to get good type definition in your IDE for yout request properties. 

* The Request class hold the following properties
    ```typescript
    method: string;
    headers: IHeaders;
    _url: string;
    socket: Socket;
    queryParams: QueryParams | object;
    ip: string;
    body: Body | undefined;
    params: RouteParameters | undefined;
    cookies: { [k: string]: string };
    raw_body: string;
    locals?: { [k: string]: string };
    data_completed: boolean;
    logFunction?: (data: logInfo) => void;
    define: () => void;
    ```

* Response class has the following properties
    ```typescript
    cookies: (_cookies: { [k:string]: { val: string; path: string; [k:string]: string } }) => void;

    send: (data: number | string | object, status: number) => void;

    setStatus: (value: number) => void;

    sendFile: async (path: string) => void;

    render: (path: string, options: object = {}, status=200) => void;
    ```

* The Ramen class has the following properties
    ```typescript
    constructor: (isRouter: boolean = false, locals = {}) => new Ramen;

    defaultAppend: (cb: (req: Request, res: Response) => any) => void;

    append: (path: string, method: string = "GET", ...cb: Array<(req: Request, res: Response, next: Function) => any>) => void;

    appendRouter: (router: Router) => void;

    listen: (port: number, cb: (port: number) => void = (port: number) => {
        console.log(`SERVER RUNNING on port : ${port}`);
    }) => void;
    ```

# Current Plans

* Create a cli for code generation
* Implement automatic documentation
* Add `@Use` decorator
* Write documentation and create better examples