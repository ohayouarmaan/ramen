import Ramen from "../../src/index";
import { Route, Get } from "../../src/router"
import Request from "../../src/Request";
import Router from "../../src/router";
import Response from "../../src/Response";

// Method#1
@Route("/api")
class API {
    @Get("/")
    APIIndex(req: Request, res: Response) {
        return res.send("Hello, world", 200);
    };
    @Get("/something")
    APIIndex2(req: Request, res: Response) {
        return res.send("Hello, world", 200);
    };
};

// method#2
const r2 = new Router("/hapi2")

r2.append("/", "GET", (req: Request, res: Response) => {
    return res.send("Hello 2", 200);
});

r2.append("/2", "GET", (req: Request, res: Response) => {
    return res.send("Hello 2", 200);
});

const server = new Ramen(false, {
    test: "1"
});

server.appendRouter(API);
server.appendRouter(r2);

server.defaultAppend((req, res) => {
    return res.send("No", 400);
});

console.log(server.graph);

server.listen(3000, () => {
    console.log("hi")
})
