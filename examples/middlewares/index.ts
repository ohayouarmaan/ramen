import Ramen from "../../index";
import path from "path";
import fs from "fs";
import Request from "../../Request";
import Response from "../../Response";

const app = new Ramen(false);

app.append("/", "GET", (req: Request,  res: Response, next: Function) => {
    next()
}, (req: Request, res: Response, next: Function) => {
    return res.send({
        "message": "Hello let's see?"
    }, 200)
});


app.listen(3000, (port) => {
    console.log(`[SERVER]: Running on port ${port}`);
});
