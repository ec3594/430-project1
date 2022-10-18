// pull in modules and files
const http = require('http');
const query = require('querystring');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// set port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// GET urls
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/favicon.ico': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/getCharacters': jsonHandler.getCharacters,
  notFound: jsonHandler.notFound,
};

// Recompiles the body of a request, and then calls the appropriate handler once completed
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

// handle post request
const handlePostRequest = (req, res, parsedUrl) => {
  console.log('in handlePostRequest');
  if (parsedUrl.pathname === '/addCharacter') {
    parseBody(req, res, jsonHandler.addCharacter);
  } else if (parsedUrl.pathname === '/deleteCharacter') {
    parseBody(req, res, jsonHandler.deleteCharacter);
  }
};

const onRequest = (req, res) => {
  console.log('in onRequest');
  console.log(`method: ${req.method}`);
  const parsedUrl = url.parse(req.url);
  const params = query.parse(parsedUrl.query);

  // handle GET
  if (req.method === 'GET') {
    // if url exists
    if (urlStruct[parsedUrl.pathname]) {
      // route to the right handler
      urlStruct[parsedUrl.pathname](req, res, params);
    } else {
      // 404 notFound
      urlStruct.notFound(req, res, params);
    }
  } else { // handle post
    handlePostRequest(req, res, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
