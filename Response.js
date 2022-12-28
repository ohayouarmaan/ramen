class Response {
    constructor(res, status) {
        this._res = res;
        this.status = status || 200;
    }

    cookies(_cookies) {
        const cookieWithValues = []
        Object.keys(_cookies).forEach(cookie => {
            cookieWithValues.push(`${cookie}=${_cookies[cookie]}`)
        });
        console.log('cookieWithValues', cookieWithValues);
        this._res.setHeader('Set-Cookie', cookieWithValues);
    }
    
    send(data, status) {
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
            this.type = "text/html"
        } else if (typeof data == "object") {
            this.data = JSON.stringify(data);
            this.type = "text/json"
        };

        this._res.writeHead(this.status, { "Content-Type": this.type });
        this._res.write(this.data);
        this._res.end();
    }
}

module.exports = Response;