import Server from "../.."; 

const app = new Server(false, { something: "something2" });

app.append("/get/:x/:y", (req, res) => {
    return res.send((req.params as { x: string, y: string }).x, 200)
});

app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
