const Request = require("./Request");
const Graph = {};

const generateReqAndRes = (req, res) => {
    const request = new Request(req);
    const response = res;
    return {request, response};
}

const append = (path, cb) => {
    Graph[path] = cb;
}

const processGraph = () => {
    Object.keys(Graph).forEach(path => {
        Graph[path]
    })
}

const Layer = (path) => {
    return;
}

module.exports = {
    Layer,
    handler
}