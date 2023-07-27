import Ramen from "../../index";
import path from "path";
import fs from "fs";
import Request from "../../Request";
import Response from "../../Response";

const app = new Ramen(false);

// GET Request for the / route
app.append("/", async (req: Request, res: Response) => {
    // req.define();
    console.log(path.resolve(__dirname, "./test.txt"));
    console.log(res);
    try{
        return await res.sendFile(path.resolve(__dirname, "./test.txt"));
    } catch(e) {
        console.log("Error occured")
    }
});

// post Request for the / route
app.append("/", async (req: Request, res: Response) => {
    await fs.writeFileSync("./something", req.raw_body)
    return res.send(req.body || "done", 200);
}, "POST")

// default route which will get forwarded to if it normally doesn't matches any other routes
app.defaultAppend((req: Request, res: Response) => {
    console.log("Default route");
    res.send("Not found", 404);
})

const port = parseInt(process.env.PORT || '3000') ;

app.listen((port as number), () => {
    console.log(`Server listening on port: ${port}`);
});

