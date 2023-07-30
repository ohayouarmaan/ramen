import Ramen from "../../src/index";
import path from "path";
import fs from "fs";
import Request from "../../src/Request";
import Response from "../../src/Response";

const app = new Ramen(false);

app.append("/", "GET", async (req: Request,  res: Response, next: Function) => {
    return next()
}, async (req: Request, res: Response) => {
    return res.send({
        "message": "Hello let's see?"
    }, 200)
});


app.listen(3000, (port) => {
    console.log(`[SERVER]: Running on port ${port}`);
});
