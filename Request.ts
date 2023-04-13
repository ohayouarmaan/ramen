// import statements
import queryString from "querystring"
import http from "http";
import { Socket } from "net";
import { parse as multipartParse, getBoundary} from "parse-multipart-data";
import { buffer } from "stream/consumers";

class Request {

    // Initial properties which a request will have
    method: string;
    protected _req: http.IncomingMessage;
    headers: { 'x-forwarded-for'?: string;
               'content-type'?: string;
               method?: string;
               cookie?: string;
               origin?: string;
               scheme?: string
               "Access-Control-Allow-Origin"?: string;
            };

    _url: string;
    socket: Socket;
    queryParams: object;
    ip: string;
    body: object | undefined;
    params: object | undefined;
    cookies: { [k: string]: string };
    raw_body: string;
    locals?: { [k: string]: string };
    data_completed: boolean;

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

        this.data_completed = false;
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

    // use this to add request body in a asynchronous fashion
    async init() {
        return new Promise(fullfill => this._req.on("end", () => {
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
                        console.log("Multipart form data found.")
                        // console.log(this.headers['content-type']);
                        
                        const boundary = (getBoundary(this.headers["content-type"]));
                        this.body = {
                            "form-data": (multipartParse(Buffer.from(this.raw_body, "utf-8"), boundary))
                        };
                    }
                }
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