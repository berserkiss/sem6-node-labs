const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        serveFile(res, 'index.html', 'text/html');
    } else if (req.url === '/math.wasm') {
        serveFile(res, 'math.wasm', 'application/wasm');
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

function serveFile(res, filename, contentType) {
    fs.readFile(path.join(__dirname, filename), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end(`Error loading ${filename}`);
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});