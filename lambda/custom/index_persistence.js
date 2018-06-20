/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

let AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';

const DYNAMODB_TABLE = 'HelloBuddySkillTable';

const SayHiHandler = {
  canHandle(handlerInput) {
    console.log("Inside SampleHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'sayHiIntent');
  },
  handle(handlerInput, error) {
    console.log("Inside SampleHandler - handle");

    let message = 'Hi. What is your name?';

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt('Can you tell me your name?')
      .getResponse();
  },
};

const GetNameHandler = {
  canHandle(handlerInput) {
    console.log("Inside SampleHandler");
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'getNameIntent');
  },
  handle(handlerInput, error) {
    console.log("Inside SampleHandler - handle");
const request = handlerInput.requestEnvelope.request;
    let name = request.intent.slots.name.value;
    
    //GET SESSION ATTRIBUTES
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //SET QUESTION DATA TO ATTRIBUTES
    attributes.name = name;

    //SAVE ATTRIBUTES
    handlerInput.attributesManager.setSessionAttributes(attributes);
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    handlerInput.attributesManager.savePersistentAttributes();
    
    let message = 'Nice to meet you ' + name;

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt('')
      .getResponse();
  },
};

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    //GET SESSION ATTRIBUTES
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //SET QUESTION DATA TO ATTRIBUTES
    let name = attributes.name;
    
    var message = STOP_MESSAGE;
    if (name != undefined) {
      message += ' ' + name;
    }
    
    return handlerInput.responseBuilder
      .speak(message)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'A year on Mercury is just 88 days long.',
  'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  'On Mars, the Sun appears about half the size as it does on Earth.',
  'Earth is the only planet not named after a god.',
  'Jupiter has the shortest day of all the planets.',
  'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  'The Sun contains 99.86% of the mass in the Solar System.',
  'The Sun is an almost perfect sphere.',
  'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  'The temperature inside the Sun can reach 15 million degrees Celsius.',
  'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    SayHiHandler,
    GetNameHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName(DYNAMODB_TABLE)
  .withAutoCreateTable(true)
  .lambda();

