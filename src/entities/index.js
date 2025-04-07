// src/entities/index.js

const Role = require('./Role');
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const TutoringSession = require('./TutoringSession');
const UserProfile = require('./UserProfile');
const JoinRequest = require('./JoinRequest'); 

const entities = {
  Role,
  User,
  ChatMessage,
  TutoringSession,
  UserProfile,
  JoinRequest 
};

// Register all associations
Object.keys(entities).forEach(modelName => {
  if (typeof entities[modelName].associate === 'function') {
    entities[modelName].associate(entities);
  }
});

// Manual association setup 
User.hasMany(JoinRequest, { foreignKey: 'userId' });
TutoringSession.hasMany(JoinRequest, { foreignKey: 'sessionId' });

JoinRequest.belongsTo(User, { foreignKey: 'userId' });
JoinRequest.belongsTo(TutoringSession, { foreignKey: 'sessionId' });

module.exports = entities;
