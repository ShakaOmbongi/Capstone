const Role = require('./Role');
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const TutoringSession = require('./TutoringSession');
const Match = require('./Match');

const entities = { Role, User, ChatMessage, TutoringSession, Match };

Object.keys(entities).forEach(modelName => {
  if (typeof entities[modelName].associate === 'function') {
    entities[modelName].associate(entities);
  }
});

module.exports = entities;
