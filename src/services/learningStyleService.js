'use strict';

const getOpenaiClient = require('../utils/openAIClient');
const LearningStyleResponse = require('../entities/LearningStyleResponse');
const User = require('../entities/User');
const Role = require('../entities/Role');
const Match = require('../entities/Match');

const learningStyleService = {
  // Save quiz answers into the database.
  async saveUserResponses(userId, role, answers) {
    return await LearningStyleResponse.create({
      userId: userId,
      role: role,
      answer1: answers[0],
      answer2: answers[1],
      answer3: answers[2],
      answer4: answers[3],
      answer5: answers[4],
      answer6: answers[5],
      answer7: answers[6],
      answer8: answers[7],
      answer9: answers[8],
      answer10: answers[9]
    });
  },

  // Generate an AI-based match.
  async generateMatch(userId) {
    // Fetch the current user.
    const user = await User.findByPk(userId);
    if (!user) {
      return { matchUser: null, score: 0, explanation: 'User not found' };
    }

    // Fetch the user's latest quiz responses.
    const userResp = await this.getLatestUserResponses(userId);
    if (!userResp) {
      return { matchUser: null, score: 0, explanation: 'No quiz responses for user' };
    }
    const userAnswers = [
      userResp.answer1, userResp.answer2, userResp.answer3,
      userResp.answer4, userResp.answer5, userResp.answer6,
      userResp.answer7, userResp.answer8, userResp.answer9,
      userResp.answer10
    ];

    // Determine the opposite role.
    let oppositeRoleId = (user.roleId === 7) ? 8 : 7;
    // Get all users with the opposite role.
    const candidates = await User.findAll({
      where: { roleId: oppositeRoleId }
    });
    if (!candidates || candidates.length === 0) {
      return { matchUser: null, score: 0, explanation: 'No potential matches found' };
    }

    let bestScore = 0;
    let bestCandidate = null;
    let bestExplanation = '';

    // Compare the current user's answers with each candidate's answers.
    for (const candidate of candidates) {
      if (candidate.id === userId) continue;
      const candResp = await this.getLatestUserResponses(candidate.id);
      if (!candResp) continue;
      const candidateAnswers = [
        candResp.answer1, candResp.answer2, candResp.answer3,
        candResp.answer4, candResp.answer5, candResp.answer6,
        candResp.answer7, candResp.answer8, candResp.answer9,
        candResp.answer10
      ];

      const prompt = this._buildPrompt(user.roleId, userAnswers, candidate.roleId, candidateAnswers);
      try {
        // Dynamically obtain the OpenAI client.
        const openai = await getOpenaiClient();
        const gptResponse = await openai.chat.completions.create({
          model: 'gpt-o3-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6
        });
        const content = gptResponse.choices[0].message.content;
        const { score, explanation } = this._parseGPTOutput(content);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          bestExplanation = explanation;
        }
      } catch (err) {
        console.error(`Error generating match for candidate ${candidate.id}:`, err);
      }
    }

    if (!bestCandidate) {
      return { matchUser: null, score: 0, explanation: 'No suitable match found' };
    }

    // Save the match in the database.
    let studentId, tutorId;
    if (user.roleId === 7) { // user is student
      studentId = userId;
      tutorId = bestCandidate.id;
    } else {
      studentId = bestCandidate.id;
      tutorId = userId;
    }
    try {
      await Match.create({
        studentId,
        tutorId,
        match_score: bestScore,
        explanation: bestExplanation
      });
    } catch (err) {
      console.error('Error saving match:', err);
    }

    return {
      matchUser: {
        id: bestCandidate.id,
        username: bestCandidate.username,
        email: bestCandidate.email
      },
      score: bestScore,
      explanation: bestExplanation
    };
  },

  // Retrieve the latest quiz responses for a user.
  async getLatestUserResponses(userId) {
    return await LearningStyleResponse.findOne({
      where: { userId },
      order: [['created_at', 'DESC']]
    });
  },

  // Build the GPT prompt.
  _buildPrompt(userRoleId, userAnswers, candidateRoleId, candidateAnswers) {
    const roleMap = { 7: 'student', 8: 'tutor' };
    const userRoleStr = roleMap[userRoleId] || 'user';
    const candidateRoleStr = roleMap[candidateRoleId] || 'user';

    let prompt = `You are an expert learning styles consultant. You are here to ensure that every student and tutor are matched perfectly and accurately. Give the student and tutor their learning style based on their question answers (either auditory, tactile, or visual). Give specific pros and cons based on the question answer choices and give recommendations for how to work best together.\n`;
    prompt += `The first set of answers is from a ${userRoleStr} and the second is from a ${candidateRoleStr}.\n\n`;
    prompt += `First Person Answers:\n`;
    userAnswers.forEach((ans, i) => {
      prompt += `${i + 1}. ${ans}\n`;
    });
    prompt += `\nSecond Person Answers:\n`;
    candidateAnswers.forEach((ans, i) => {
      prompt += `${i + 1}. ${ans}\n`;
    });
    prompt += `\nReturn in this format:\n`;
    prompt += `Compatibility Score: [0-100]\n`;
    prompt += `Explanation: [detailed explanation with specific examples]\n`;
    prompt += `Learning Style: [either auditory, tactile, or visual based on the responses]\n`;
    return prompt;
  },

  // Parse the GPT output.
  _parseGPTOutput(content) {
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
    // Clamp score between 0 and 100.
    score = Math.max(0, Math.min(score, 100));
    return { score, explanation };
  }
};

module.exports = learningStyleService;
