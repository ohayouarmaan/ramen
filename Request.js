class Request {
    constructor(req) {
        this.method = (req.method);
        this._req = req;
        this.headers = req.headers;
        this._url = req.url;
        this.queryParams = this._url.includes("?") ? this.parse(this._url) : {};
        this.body = "";
        
        // Request data stream
        // the data stream gives you the body object
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
    };

    define() {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        console.log(`
            Method: ${this.method};
            Url: ${this._url};
        `)
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
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

}

module.exports = Request;
