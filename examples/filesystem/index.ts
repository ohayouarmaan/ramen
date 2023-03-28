
import Ramen from "../../index";
import path from "path";
import fs from "fs";
import Request from "../../Request";
import Response from "../../Response";

const app = new Ramen(false);

// GET Request for the / route
app.append("/", (req: Request, res: Response) => {
    req.define();
    return res.sendFile(path.resolve(__dirname, "./test.txt"));
}, "GET");

// post Request for the / route
app.append("/", async (req: Request, res: Response) => {
    req.define();
    await fs.writeFileSync("./something", req.raw_body)
    return res.send(req.body || "done", 200);
}, "POST")

// default route which will get forwarded to if it normally doesn't matches any other routes
app.defaultAppend((req: Request, res: Response) => {
    req.define();
    res.send("Not found", 404);
})

const port = parseInt(process.env.PORT || '3000') ;

app.listen((port as number), () => {
    console.log(`Server listening on port: ${port}`);
});

console.log(`Server listening on port ${port}`);
