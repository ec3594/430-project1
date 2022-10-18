const data = require('../data/data.json');

const { characters } = data;

// function to respond with a json object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// return characters object as JSON
const getCharacters = (request, response) => {
  respondJSON(request, response, 200, characters);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// function to add a character from a POST body
const addCharacter = (request, response, body) => {
  console.log('in addCharacter');

  // default json message
  const responseJSON = {
    message: 'Name, Job, and Personality are all required!',
  };

  // If any fields are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.job || !body.personality) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the character doesn't exist yet
  if (!characters[body.name]) {
    // Set the status code to 201 (created)
    responseCode = 201;
    characters[body.name] = {};
    // characters.push({ name: `${body.name}` });
  }

  // add or update fields for this character's name
  console.log(`updating character ${body.name}`);
  characters[body.name].name = body.name;
  characters[body.name].job = body.job;
  characters[body.name].personality = body.personality;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    // responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, characters);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// function to delete a character from a POST body
const deleteCharacter = (request, response, body) => {
  console.log('in deleteCharacter');

  console.log(`deleting character ${body.name}`);

  delete characters[body.name];

  return respondJSONMeta(request, response, 204);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = {
  getCharacters,
  addCharacter,
  deleteCharacter,
  notFound,
};
