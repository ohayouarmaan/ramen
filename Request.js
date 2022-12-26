class Request {
    constructor(req) {
        this.method = (req.method);
        this._req = req;
        this.headers = req.headers;
        this._url = req.url;
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

}

module.exports = Request;
