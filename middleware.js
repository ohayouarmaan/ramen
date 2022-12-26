const Request = require("./Request");

const generateReqAndRes = (req, res) => {
    const request = new Request(req);
    const response = res;
    return {request, response};
}

const append = (path, cb) => {
    
}

const Layer = (path) => {
    return;
}

module.exports = {
    Layer,
    handler
}