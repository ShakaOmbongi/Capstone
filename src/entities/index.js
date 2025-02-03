const Role = require('./Role');
const User = require('./User');

const entities = { Role, User };

Object.keys(entities).forEach(modelName => {
  if (typeof entities[modelName].associate === 'function') {
    entities[modelName].associate(entities);
  }
});

module.exports = entities;
