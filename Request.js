class Request {
    constructor(req) {

        // Set properties
        this.method = (req.method);
        this._req = req;
        this.headers = req.headers;
        this._url = req.url;
        
        // Parse Query Parameters
        this.queryParams = this._url.includes("?") ? this.parse(this._url) : {};

        // Request data stream
        // the data stream gives you the body object
        this.body = "";
        this._req.on("data", e => {
            this.body += e;
        });
        this._req.on("end", e => {
            if(this.body == "" || this.body == "\n") {
                this.body = {}
            } else {
                this.body = JSON.parse(this.body);
            };
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
        console.log(params)
        params = params.slice(1, params.length)
        params = params[0].split("&");
        console.log(params);
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
