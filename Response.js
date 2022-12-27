class Response {
    constructor(res, status) {
        this._res = res;
        this.status = status || 200;
    }

    send(data) {
        if(typeof data == "number") {
            this.status = data
            this.type = "status"
        } else if(typeof data == "string") {
            this.data = data;
            this.type = "text/html"
        } else if (typeof data == "object") {
            this.data = JSON.stringify(data);
            this.type = "text/json"
        };
    }
}