let message = "<say-as interpret-as='interjection'>g'day</say-as>";
message += "<break time='1s'/>" + " What is your name?”;


let message = "<say-as interpret-as='interjection'>kia ora</say-as>";
message += "<break time='1s'/>" + " What is your name?";

const Alexa = require('ask-sdk');

const SampleHandler = {
  canHandle(handlerInput) {
    console.log("Inside SampleHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'sampleIntent');
  },
  handle(handlerInput, error) {
    console.log("Inside SampleHandler - handle");

    let message = 'Test';

    return handlerInput.responseBuilder
      .speak(message)
      .getResponse();
  },
};


/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const HiHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'LaunchRequest') ||
          (request.type === 'IntentRequest' &&
          request.intent.name === 'helloIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Hi. What is your name?')
      .reprompt('Your name?')
      .getResponse();
  },
};

const NameHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
          request.intent.name === 'NameIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    let name = request.intent.slots.Name.value;
    
    //GET SESSION ATTRIBUTES
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //SET QUESTION DATA TO ATTRIBUTES
    attributes.name = name;

    //SAVE ATTRIBUTES
    handlerInput.attributesManager.setSessionAttributes(attributes);
    
    return handlerInput.responseBuilder
      .speak('Hello ' + name + ' Nice to meet you.')
      .reprompt('')
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
    
    console.log(name);
    console.log(name != undefined);
    console.log(message);
    
    return handlerInput.responseBuilder
      .speak(message)
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
    const speechOutput = "Hello, " + GET_FACT_MESSAGE + randomFact;

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
    HiHandler,
    NameHandler,
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
