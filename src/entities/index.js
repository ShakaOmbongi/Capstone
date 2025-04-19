// src/entities/index.js

const Role = require('./Role');
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const TutoringSession = require('./TutoringSession');
const UserProfile = require('./UserProfile');
const JoinRequest = require('./JoinRequest'); 
const FeedbackReview = require('./FeedbackReview');

const entities = {
  Role,
  User,
  ChatMessage,
  TutoringSession,
  UserProfile,
  JoinRequest,
  FeedbackReview
};

// Register all associations
Object.keys(entities).forEach(modelName => {
  if (typeof entities[modelName].associate === 'function') {
    entities[modelName].associate(entities);
  }
});

User.hasMany(JoinRequest, { foreignKey: 'studentId', as: 'joinRequests' });
TutoringSession.hasMany(JoinRequest, { foreignKey: 'sessionId', as: 'joinRequests' });

JoinRequest.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
JoinRequest.belongsTo(TutoringSession, { foreignKey: 'sessionId', as: 'session' });


module.exports = entities;
