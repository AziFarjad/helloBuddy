/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

let AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';

const DYNAMODB_TABLE = 'HelloBuddySkillTable';

const SayHiHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'sayHiIntent');
  },
  handle(handlerInput) {
    let message = 'hi. what is your name?';

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt('')
      .withSimpleCard("Name", "Azi")
      .getResponse();
  },
};

const GetNameHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'getNameIntent');
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
    
    handlerInput.attributesManager.setPersistentAttributes(attributes);

    //handlerInput.attributesManager.savePersistentAttributes() // we have it in response Intercepter

    let message = 'Nice to meet you ' + name;

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt('')
      .getResponse();
  },
};

const ResponsePersistenceInterceptor = {
    process(handlerInput, responseOutput) {
        
            //let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            //sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime();

            //handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);

            return new Promise((resolve, reject) => {
                handlerInput.attributesManager.savePersistentAttributes()
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
    }
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

/*export const preInterceptor = {
  async process(handlerInput: HandlerInput) {
    // console.log(
    //   "REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope)
    // );
 
    if (handlerInput.requestEnvelope.session.new) {
      const attributes = await handlerInput.attributesManager.getPersistentAttributes();
      console.log(attributes);
 
      if ("invocationCount" in attributes) {
        attributes["invocationCount"] = attributes["invocationCount"] + 1;
      } else {
        attributes["invocationCount"] = 1;
      }
 
      handlerInput.attributesManager.setPersistentAttributes(attributes);
 
      handlerInput.attributesManager.savePersistentAttributes();
    }
*/

const RequestPersistenceInterceptor = {
    process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']) {

            return new Promise((resolve, reject) => {

                handlerInput.attributesManager.getPersistentAttributes()

                    .then((sessionAttributes) => {
                        sessionAttributes = sessionAttributes || {};

                        // console.log(JSON.stringify(sessionAttributes, null, 2));

                        // if(Object.keys(sessionAttributes).length === 0) {
                        //     console.log('--- First Ever Visit for userId ' + handlerInput.requestEnvelope.session.user.userId);

                        //     const initialAttributes = constants.getMemoryAttributes();
                        //     sessionAttributes = initialAttributes;

                        // }

                        sessionAttributes['launchCount'] = 1;
                        // sessionAttributes['tempPassPhrase'] = generatePassPhrase().word1 + '-' + generatePassPhrase().word2 + '-' + generatePassPhrase().number;

                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                        handlerInput.attributesManager.savePersistentAttributes()
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });

                    });

            });

        } // end session['new']

    }
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

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    SayHiHandler,
    GetNameHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addResponseInterceptors(ResponsePersistenceInterceptor)
  .addRequestInterceptors(RequestPersistenceInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withTableName(DYNAMODB_TABLE)
  .withAutoCreateTable(true)
  .lambda();
