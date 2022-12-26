class Request {
    constructor(req) {
        this._req = req;
        this._url = req.url;
        this.body = "";

        this._req.on("data", e => {
            this.body += e;
        })

        this._req.on("end", e => {
            console.log(this.body);
            if(this.body == "") {
                this.body = {}
            } else {
                this.body = JSON.parse(this.body);
            };
        });
    };
}

module.exports = Request;