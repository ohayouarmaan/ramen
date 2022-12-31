const { MIME_TYPES } = require("./Constants");
const EJS = require("ejs");

class Response {
    constructor(res, status) {
        this._res = res;
        this.status = status || 200;
    }

    cookies(_cookies) {
        console.log(_cookies);
        const cookieWithValues = []
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
            this.type = MIME_TYPES.html
        } else if (typeof data == "object") {
            this.data = JSON.stringify(data);
            this.type = MIME_TYPES.json
        };

        this._res.writeHead(this.status, { "Content-Type": this.type });
        this._res.write(this.data);
        this._res.end();
    }

    async render(path, options, status=200) {
        try {
            const html = await EJS.renderFile(path, options);
            this.send(html, status)
        } catch(e) {
            const html = String(e);
            this.send(html, 400);
        };
    };

}

module.exports = Response;