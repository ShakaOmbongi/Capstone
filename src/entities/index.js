// src/entities/index.js

const Role = require('./Role');
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const TutoringSession = require('./TutoringSession');
const UserProfile = require('./UserProfile');
const JoinRequest = require('./JoinRequest');
const FeedbackReview = require('./FeedbackReview');
const Report = require('./Report');
const Match = require('./Match');

const entities = {
  Role,
  User,
  ChatMessage,
  TutoringSession,
  UserProfile,
  JoinRequest,
  FeedbackReview,
  Report ,
  Match
};

// Register all associations (handled in each model)
Object.keys(entities).forEach(modelName => {
  if (typeof entities[modelName].associate === 'function') {
    entities[modelName].associate(entities);
  }
});

module.exports = entities;
