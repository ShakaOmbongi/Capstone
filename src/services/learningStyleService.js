'use strict';

const openai = require('../utils/openAIClient');
const LearningStyleResponse = require('../entities/LearningStyleResponse');
const User = require('../entities/User');
const Role = require('../entities/Role');
const Match = require('../entities/Match');  // Ensure you have this model

module.exports = {
  // Save user responses in one row
  async saveUserResponses(userId, userRole, answers) {
    await LearningStyleResponse.create({
      userId: userId,
      role: userRole,
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

  // Generate a match using GPT-based logic and save the match
  async generateMatch(userId) {
    const user = await User.findByPk(userId, { include: [{ model: Role, as: 'role' }] });
    if (!user) return { matchUser: null, score: 0, explanation: 'User not found' };

    let currentRole;
    if (user.role && user.role.name) {
      currentRole = user.role.name.toUpperCase();
    } else {
      const roleRecord = await Role.findByPk(user.roleId);
      if (!roleRecord) return { matchUser: null, score: 0, explanation: 'User role not found' };
      currentRole = roleRecord.name.toUpperCase();
    }

    const userResp = await LearningStyleResponse.findOne({
      where: { userId },
      order: [['created_at', 'DESC']]
    });
    if (!userResp) return { matchUser: null, score: 0, explanation: 'No quiz responses for this user' };

    const userAnswers = [
      userResp.answer1, userResp.answer2, userResp.answer3, userResp.answer4, userResp.answer5,
      userResp.answer6, userResp.answer7, userResp.answer8, userResp.answer9, userResp.answer10
    ];

    let oppositeRoleName;
    if (currentRole === 'STUDENT') {
      oppositeRoleName = 'TUTOR';
    } else if (currentRole === 'TUTOR') {
      oppositeRoleName = 'STUDENT';
    } else {
      return { matchUser: null, score: 0, explanation: 'User role not supported for matching' };
    }

    const candidates = await User.findAll({ where: { roleId: oppositeRole.id } });
    if (!candidates || candidates.length === 0) return { matchUser: null, score: 0, explanation: 'No potential matches found' };

    let bestScore = 0, bestCandidate = null, bestExplanation = '';
    for (const candidate of candidates) {
      if (candidate.id === userId) continue;
      let candidateRoleName;
      if (candidate.role && candidate.role.name) {
        candidateRoleName = candidate.role.name;
      } else {
        const roleRecord = await Role.findByPk(candidate.roleId);
        candidateRoleName = roleRecord ? roleRecord.name : '';
      }
      const candResp = await LearningStyleResponse.findOne({
        where: { userId: candidate.id },
        order: [['created_at', 'DESC']]
      });
      if (!candResp) continue;
      const candidateAnswers = [
        candResp.answer1, candResp.answer2, candResp.answer3, candResp.answer4, candResp.answer5,
        candResp.answer6, candResp.answer7, candResp.answer8, candResp.answer9, candResp.answer10
      ];
      const prompt = buildPrompt(userAnswers, candidateAnswers, currentRole, candidateRoleName);
      try {
        const gptResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6
        });
        const content = gptResponse.choices[0].message.content;
        const { score, explanation } = parseGPTOutput(content);
        if (score > bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          bestExplanation = explanation;
        }
      } catch (err) {
        console.error('Error generating match for candidate', candidate.id, err);
      }
    }

    if (!bestCandidate) return { matchUser: null, score: 0, explanation: 'No suitable match found' };

    // Save the match in the "matches" table
    if (currentRole === 'STUDENT') {
      await Match.create({
        studentId: userId,
        tutorId: bestCandidate.id,
        matchScore: bestScore,
        explanation: bestExplanation
      });
    } else if (currentRole === 'TUTOR') {
      await Match.create({
        studentId: bestCandidate.id,
        tutorId: userId,
        matchScore: bestScore,
        explanation: bestExplanation
      });
    }

    return {
      matchUser: { id: bestCandidate.id, username: bestCandidate.username, email: bestCandidate.email },
      score: bestScore,
      explanation: bestExplanation
    };
  }
};

/** Helper: Build a GPT prompt comparing two sets of 10 answers */
function buildPrompt(userAnswers, candidateAnswers, userRole, candidateRole) {
  let prompt = `You are an expert learning styles consultant.\n`;
  prompt += `The first set of answers is from a ${userRole.toLowerCase()}, and the second is from a ${candidateRole.toLowerCase()}.\n\n`;
  prompt += `First Person Answers:\n`;
  userAnswers.forEach((ans, i) => { prompt += `${i + 1}. ${ans}\n`; });
  prompt += `\nSecond Person Answers:\n`;
  candidateAnswers.forEach((ans, i) => { prompt += `${i + 1}. ${ans}\n`; });
  prompt += `\nReturn in this exact format:\nCompatibility Score: [0-100]\nExplanation: [detailed explanation]\n`;
  return prompt;
}

/** Helper: Parse GPT output to extract score and explanation */
function parseGPTOutput(content) {
  let score = 0, explanation = '';
  const scoreMatch = content.match(/Compatibility Score:\s*(\d+)/i);
  if (scoreMatch) score = parseInt(scoreMatch[1], 10);
  const explanationMatch = content.match(/Explanation:\s*(.*)/is);
  if (explanationMatch) explanation = explanationMatch[1].trim();
  return { score, explanation };
}
