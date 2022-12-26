const Request = require("./Request");

const handler = (req, res) => {
    const request = new Request(req);
    const response = res;
}

const Layer = (path) => {
    return;
}

module.exports = {
    Layer,
    handler
}