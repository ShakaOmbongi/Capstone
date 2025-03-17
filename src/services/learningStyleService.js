'use strict';

const LearningStyleQuestionRepository = require('../repositories/LearningStyleQuestionRepository');
const LearningStyleResponse = require('../entities/LearningStyleResponse');
const LearningStyleResult = require('../entities/LearningStyleResult');
const User = require('../entities/User');
const Role = require('../entities/Role');
const openai = require('../utils/openAIClient'); // We'll create this next
const { Op } = require('sequelize');

module.exports = {
  // 1. Return all questions from DB
  async fetchQuestions() {
    return await LearningStyleQuestionRepository.getAllQuestions();
  },

  // 2. Save user responses
  //    responses = [ { questionId, answer }, ...]
  async saveUserResponses(userId, responses) {
    // Insert into learning_style_responses
    for (const { questionId, answer } of responses) {
      await LearningStyleResponse.create({
        userId,
        questionId,
        answer
      });
    }
  },

  // 3. Generate a match with GPT-based logic
  async generateMatch(userId) {
    // Step 1: find user & role
    const user = await User.findByPk(userId, { include: [{ model: Role, as: 'role' }] });
    if (!user) {
      return { matchUser: null, score: 0, explanation: 'User not found' };
    }

    // Step 2: gather user’s responses
    const userResponses = await LearningStyleResponse.findAll({ where: { userId } });
    if (userResponses.length === 0) {
      return { matchUser: null, score: 0, explanation: 'No quiz responses for this user' };
    }
    const userAnswers = userResponses.map(r => r.answer);

    // Step 3: figure out opposite role
    // If user.role.name === 'STUDENT', we look for 'TUTOR', etc.
    let oppositeRoleName;
    if (user.role.name.toUpperCase() === 'STUDENT') {
      oppositeRoleName = 'TUTOR';
    } else if (user.role.name.toUpperCase() === 'TUTOR') {
      oppositeRoleName = 'STUDENT';
    } else {
      return { matchUser: null, score: 0, explanation: 'Role not supported for matching' };
    }

    const oppositeRole = await Role.findOne({ where: { name: oppositeRoleName } });
    if (!oppositeRole) {
      return { matchUser: null, score: 0, explanation: `Opposite role (${oppositeRoleName}) not found` };
    }

    // Step 4: find all users with that role
    const potentialMatches = await User.findAll({
      where: { roleId: oppositeRole.id }
    });
    if (potentialMatches.length === 0) {
      return { matchUser: null, score: 0, explanation: 'No potential matches found' };
    }

    let bestScore = 0;
    let bestCandidate = null;
    let bestExplanation = '';

    // For each candidate, fetch their responses, call GPT
    for (const candidate of potentialMatches) {
      const candidateResponses = await LearningStyleResponse.findAll({ where: { userId: candidate.id } });
      if (candidateResponses.length === 0) continue;

      const candidateAnswers = candidateResponses.map(r => r.answer);
      // Build GPT prompt
      const prompt = buildPrompt(userAnswers, candidateAnswers, user.role.name, candidate.role.name);

      try {
        const resp = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6
        });
        const content = resp.choices[0].message.content;
        const { score, explanation } = parseGPTOutput(content);

        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          bestExplanation = explanation;
        }
      } catch (err) {
        console.error('GPT error for candidate', candidate.id, err);
      }
    }

    if (!bestCandidate) {
      return { matchUser: null, score: 0, explanation: 'No suitable match found' };
    }

    // Optionally store in learning_style_results
    await LearningStyleResult.create({
      userId,
      learningStyle: 'N/A', // or you can parse a style from GPT
      score: bestScore
    });

    // Return partial user data
    const matchedUser = {
      id: bestCandidate.id,
      username: bestCandidate.username,
      email: bestCandidate.email
    };

    return { matchUser: matchedUser, score: bestScore, explanation: bestExplanation };
  }
};

/** Build the GPT prompt comparing user answers vs candidate's answers */
function buildPrompt(userAnswers, candidateAnswers, userRole, candidateRole) {
  let prompt = `You are an expert learning styles consultant.\n`;
  prompt += `Compare these sets of answers. The first is a ${userRole}, second is a ${candidateRole}.\n`;
  prompt += `\nFirst person answers:\n`;
  userAnswers.forEach((ans, i) => {
    prompt += `${i + 1}. ${ans}\n`;
  });
  prompt += `\nSecond person answers:\n`;
  candidateAnswers.forEach((ans, i) => {
    prompt += `${i + 1}. ${ans}\n`;
  });
  prompt += `
Return:
Compatibility Score: [0-100]
Explanation: [analysis in a few sentences]
`;
  return prompt;
}

/** Parse out score/explanation from GPT response text */
function parseGPTOutput(content) {
  let score = 0;
  let explanation = '';

  const scoreMatch = content.match(/Compatibility Score:\s*(\d+)/i);
  if (scoreMatch) {
    score = parseInt(scoreMatch[1], 10);
  }
  const explanationMatch = content.match(/Explanation:\s*(.*)/is);
  if (explanationMatch) {
    explanation = explanationMatch[1].trim();
  }

  return { score, explanation };
}
