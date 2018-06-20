let AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';

const DYNAMODB_TABLE = 'HelloBuddySkillTable';

  .withTableName(DYNAMODB_TABLE)
  .withAutoCreateTable(true)

Following lines whenever I am persisting data in database:
//SAVE ATTRIBUTES
    handlerInput.attributesManager.setSessionAttributes(attributes);
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    handlerInput.attributesManager.savePersistentAttributes();

Add Dynamo DB Access role
