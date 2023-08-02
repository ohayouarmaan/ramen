import * as EJS from "ejs";
import http from "http";
import fs from "fs";
import { MIME_TYPES } from "./Constants";

class Response {
    protected _res: http.ServerResponse;
    status: number;
    type?: string;
    data?: string | object | fs.ReadStream;

    constructor(res: http.ServerResponse, status: number = 200) {
        this._res = res;
        this.status = status;
    };
    

    cookies(_cookies: { [k:string]: { val: string; path: string; [k:string]: string } }) {
        console.log(_cookies);
        const cookieWithValues: Array<string> = []
        Object.keys(_cookies).forEach(cookie => {
            let path;
            if(Object.keys(_cookies[cookie]).includes("path")) {
                path = _cookies[cookie]['path'];
            } else {
                path = "/"
            };

            let options = ""
            Object.keys(_cookies[cookie]).forEach(opt => {
                if(opt != "val") {
                    options += `${opt}=${_cookies[cookie][opt]};`;
                };
            })
            cookieWithValues.push(`${cookie}=${_cookies[cookie]['val']};${options}`)
        });
        console.log('cookieWithValues', cookieWithValues);
        this._res.setHeader('Set-Cookie', cookieWithValues);
    }

    send(data: number | string | object, status: number) {
        if(status) {
            this.status = status;
        }
        if(typeof data == "number") {
            this.status = data
            this.type = "status"
            this._res.writeHead(this.status);
            return this._res.end()
        } else if(typeof data == "string") {
            this.data = data;
            this.type = MIME_TYPES.html
        } else if (typeof data == "object") {
            this.data = JSON.stringify(data);
            this.type = MIME_TYPES.json
        };

        this._res.writeHead(this.status, { "Content-Type": this.type });
        this._res.write(this.data);
        this._res.end();
    }

    setStatus(value: number) {
        this.status = value;
        return this;
    }

    async sendFile(path: string) {
        const stream = await fs.createReadStream(path);
        const fileName = path.split("/")[path.split("/").length - 1];
        this._res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + fileName
        });
        stream.pipe(this._res);
    }

    async render(path: string, options: object = {}, status=200) {
        try {
            const html = await EJS.renderFile(path, options);
            this.send(html, status)
        } catch(e) {
            const html = String(e);
            this.send(html, 400);
        };
    };
}

export default Response;
