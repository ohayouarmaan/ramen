const url = require("url");
const E = require("events");
const querystring = require("querystring")

class Request {
    constructor(req) {
        // Set properties
        this.method = req.method;
        this._req = req;
        this.headers = req.headers;
        this._url = req.url;
        this.connection = req.connection || {};
        this.socket = req.socket || {};
        this.ip = 
            this.headers['x-forwared-for'] || 
            this.connection.remoteAddress || 
            this.socket.remoteAddress || 
            this.connection.socket?.remoteAddress;
        
        // Parse Query Parameters
        this.queryParams = this._url.includes("?") ? this.parse(this._url) : {};

        // Request data stream
        // the data stream gives you the body object
        this.body = "";
        this._req.on("data", e => {
            this.body += e;
        });

        // Parse Cookies
        this.cookies = {};
        if(Object.keys(this._req.headers).includes("cookie")){
            const _cookies = this._req.headers.cookie.split("; ");
            _cookies.forEach(cookie => {
                const cookieName = cookie.split("=")[0];
                const value = cookie.split("=")[cookie.split("=").length - 1];
                this.cookies[cookieName] = value;
            });
        }
    };

    // something = new Promise((resolve, reject) => {
    //     // Request data stream
    //     // the data stream gives you the body object
    //     this.body = "";
    //     this._req.on("data", e => {
    //         this.body += e;
    //     });

    //     this._req.on("end", async (e) => {
    //         if(this.body == "" || this.body == "\n") {
    //             this.body = {}
    //         } else {
    //             if (this.headers['content-type']) {
    //                 if(this.headers['content-type'] == 'application/x-www-form-urlencoded') {
    //                     const data = querystring.decode(this.body);
    //                     this.body = data;
    //                     return true;
    //                 } else if(this.headers['content-type'] == 'application/json') {
    //                     this.body = JSON.parse(this.body);
    //                     return true;
    //                 }
    //             }
    //         };
    //     });
    //     resolve(1);
    // })

    async init() {
        return new Promise(fullfill => this._req.on("end", () => {
            if(this.body == "" || this.body == "\n") {
                this.body = {}
            } else {
                if (this.headers['content-type']) {
                    if(this.headers['content-type'] == 'application/x-www-form-urlencoded') {
                        const data = querystring.decode(this.body);
                        this.body = data;
                    } else if(this.headers['content-type'] == 'application/json') {
                        this.body = JSON.parse(this.body);
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
        `)
        console.log('________________________________________________________');
    }

    parse(url) {
        let params = url.split("?");
        // console.log(params)
        params = params.slice(1, params.length)
        params = params[0].split("&");
        // console.log(params);
        const qps = {};
        params.forEach(p => {
            const q = p.split("=")[0];
            const _p = p.split("=")[1];
            qps[q] = _p;
        });
        return qps;
    }

    // A function which will add route parameters.
    addParams(params) {
        this.params = params
    }
}

module.exports = Request;
