// import statements
import queryString from "querystring"
import http from "http";
import { Socket } from "net";
import { green, gray, red } from "colors";

interface IHeaders {
    'x-forwarded-for'?: string;
    'content-type'?: string;
    method?: string;
    cookie?: string;
    origin?: string;
    scheme?: string
    "Access-Control-Allow-Origin"?: string;
    [key: string]: string | string[] | undefined;
}

interface logInfo {
    time: number;
    route: string;
    method: string;
    headers: IHeaders;
    body: object | undefined;
    ip: string;
    socketRemoteAddress: Socket;
}

class Request {
    // Initial properties which a request will have
    method: string;
    protected _req: http.IncomingMessage;
    headers: IHeaders;

    _url: string;
    socket: Socket;
    queryParams: object;
    ip: string;
    body: object | undefined;
    params: object | undefined;
    cookies: { [k: string]: string };
    raw_body: string;
    locals?: { [k: string]: string };
    logFunction?: (data: logInfo) => void;


    constructor(req: http.IncomingMessage) {
        // Set properties
        this.method = req.method || "";
        this._req = req;
        this.headers = req.headers;
        this._url = req.url || "";
        this.socket = req.socket || {};
        this.ip =
            this.headers['x-forwarded-for'] ||
            this.socket.remoteAddress || '';

        // Parse Query Parameters
        this.queryParams = this._url.includes("?") ? this.parse(this._url) : {};

        // Request data stream
        // the data stream gives you the body object
        this.raw_body = "";
        this._req.on("data", e => {
            this.raw_body += e;
        });

        // Parse Cookies
        this.cookies = {};
        if (Object.keys(this._req.headers).includes("cookie")) {
            const _cookies = this._req.headers.cookie?.split("; ") || [];
            _cookies.forEach(cookie => {
                const cookieName = cookie.split("=")[0];
                const value = cookie.split("=")[cookie.split("=").length - 1];
                this.cookies[cookieName] = value;
            });
        }
    };

    assignLogger(cb: (data: logInfo) => void){
        this.logFunction = cb;
    }

    async logger(data: logInfo) {
        if(this.logFunction){
            await this.logFunction(data);
        } else {
            console.log(green(`${data.route} | ${data.method}`));
        }
    }

    // use this to add request body in a asynchronous fashion
    async init() {
        return new Promise((fullfill) => this._req.on("end", async () => {
            if (this.raw_body == "" || this.raw_body == "\n") {
                this.body = {}
            } else {
                if (this.headers['content-type']) {
                    if (this.headers['content-type'] == 'application/x-www-form-urlencoded') {
                        const data = queryString.decode(this.raw_body);
                        this.body = data;
                    } else if (this.headers['content-type'] == 'application/json') {
                        this.body = JSON.parse(this.raw_body);
                    } else if(this.headers['content-type'].startsWith("multipart/form-data;")) {
                        const boundary = this.headers['content-type']
                            .split(";")[1]
                            .trim()
                            .split("=")[1]
                        this.body = {};
                    }
                }
                await this.logger({time: Date.now(), route: this._url, method: this.method, headers: this.headers, body: this.body, ip: this.ip, socketRemoteAddress: this.socket})
            };
            fullfill(1);
        }))
    };

    define() {
        console.log('________________________________________________________');
        console.log(`
            Method: ${this.method};
            Url: ${this._url};
        `);
        console.log('________________________________________________________');
    }

    // parses url in key value pairs
    parse(url: string) {
        let params = url.split("?");
        // console.log(params)
        params = params.slice(1, params.length)
        params = params[0].split("&");
        // console.log(params);
        const qps: { [x: string]: string } = {};
        params.forEach(p => {
            const q = p.split("=")[0];
            const _p = p.split("=")[1];
            qps[q] = _p;
        });
        return qps;
    }

    // A function which will add route parameters.
    addParams(params: { [key: string]: string }) {
        this.params = params
    }
}

export default Request;