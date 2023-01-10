import Ramen from "../../index";
import path from "path";
import Request from "../../Request";
import Response from "../../Response";

const app = new Ramen(false);

app.append("/", (req: Request, res: Response) => {
    req.define();
    return res.sendFile(path.resolve(__dirname, "./test.txt"));
}, "GET");

app.defaultAppend((req: Request, res: Response) => {
    req.define();
    res.send("Not found", 404);
})

const port = parseInt(process.env.PORT || '3000') ;
app.listen((port as number), () => {
    console.log(`Server listening on port: ${port}`);
})
