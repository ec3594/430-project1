const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// respond with the file and content type passed in
const loadFile = (request, response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(file);
  response.end();
};

const getIndex = (request, response) => {
  loadFile(request, response, index, 'text/html');
};

const getStyle = (request, response) => {
  loadFile(request, response, style, 'text/css');
};

module.exports = {
  getIndex,
  getStyle,
};
