'use strict';

const LearningStyleResponse = require('../entities/LearningStyleResponse');
const User = require('../entities/User');
const Role = require('../entities/Role');
const Match = require('../entities/Match');

const learningStyleService = {
  // Save quiz answers into the database.
  async saveUserResponses(userId, role, answers) {
    return await LearningStyleResponse.create({
      userId,
      role,
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
      return { matchUser: null, score: 0, explanation: 'User not found', learning_style: 'N/A' };
    }

    // Fetch the user's latest quiz responses.
    const userResp = await this.getLatestUserResponses(userId);
    if (!userResp) {
      return { matchUser: null, score: 0, explanation: 'No quiz responses for user', learning_style: 'N/A' };
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
      return { matchUser: null, score: 0, explanation: 'No potential matches found', learning_style: 'N/A' };
    }

    let bestScore = -1;
    let bestCandidate = null;
    let bestExplanation = '';
    let bestLearningStyle = 'N/A';

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
        const openaiModule = await import('openai');
        const { OpenAI } = openaiModule;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        const gptResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6
        });
        const content = gptResponse.choices[0].message.content;
        const { score, explanation, learningStyle } = this._parseGPTOutput(content);
        if (score >= bestScore) {
          bestScore = score;
          bestCandidate = candidate;
          bestExplanation = explanation;
          bestLearningStyle = learningStyle;
        }
      } catch (err) {
        console.error(`Error generating match for candidate ${candidate.id}:`, err);
      }
    }

    // Fallback: if no candidate was scored, choose the first candidate.
    if (!bestCandidate) {
      bestCandidate = candidates[0];
      bestScore = 0;
      bestExplanation = 'Default match selected (no quiz responses available for candidates)';
      bestLearningStyle = 'N/A';
    }

    // For a student, assume the match record is saved with studentId = userId and tutorId = bestCandidate.id.
    let studentId, tutorId;
    if (user.roleId === 7) {
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
        explanation: bestExplanation,
        learning_style: bestLearningStyle
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
      explanation: bestExplanation,
      learning_style: bestLearningStyle
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
    // 1) Quiz questions
    const QUESTIONS = [
      "I follow written directions better than oral directions.",
      "I can remember more about a subject through listening than reading.",
      "I bear down extremely hard when writing.",
      "I like to write things down or take notes for visual review.",
      "I require explanations of graphs, diagrams, or visual directions.",
      "I enjoy working with tools.",
      "I am skillful and enjoy developing and making graphs and charts.",
      "I can tell if sounds match when presented with pairs of sounds.",
      "I remember best by writing things down several times.",
      "I can understand and follow directions on maps."
    ];
  
    // 2) Map roles
    const roleMap  = { 7: "Student", 8: "Tutor" };
    const youRole  = roleMap[userRoleId]      || "User";
    const themRole = roleMap[candidateRoleId] || "User";
  
    // 3) Build prompt
    let prompt = `
  You are an expert learning-styles consultant. I will give you 10 questions along with the ${youRole}’s answer and the ${themRole}’s answer.
  
  **For each question**, do the following, referencing the full question text:
  1. **Interpretation**: Explain exactly what the question is asking and what each person’s answer means.
  2. **Strength**: Identify one specific alignment based on these answers (mention the question text and answers).
  3. **Challenge**: Identify one specific difference (mention the question text and answers) that could create difficulty.
  4. **Strategy**: Propose one concrete way the pair can leverage the strength or overcome the challenge.
  
  After analyzing all ten, provide:
  
  Compatibility Score: [0–100]
  
  Explanation:
  - Strengths (at least two bullet points, each referencing question text and answers):
      ...
      ...
  
  - Challenges:
      ...
      
  Overall Explanation:
  Provide a concise paragraph summarizing how their combined strengths and challenges influence their overall compatibility and what they should focus on together.
  
  Learning Style: [auditory/tactile/visual]
  
  ---
  
  `;
  
    // 4) Append each question with answers
    QUESTIONS.forEach((qText, i) => {
      prompt += `Question ${i+1}: ${qText}\n`;
      prompt += `- ${youRole} answered: ${userAnswers[i]}\n`;
      prompt += `- ${themRole} answered: ${candidateAnswers[i]}\n\n`;
    });
  
    // 5) Return format reminder
    prompt += `
  Return in this exact format:
  Compatibility Score: [0–100]
  
  Explanation:
  - Strengths (at least two bullet points):
      ...
      ...
  
  - Challenges:
      ...
  
  Overall Explanation:
  ...
  
  Learning Style: [auditory/tactile/visual]
  `.trim();
  
    return prompt;
  },
  
  // Parse the GPT output.
  _parseGPTOutput(content) {
    let score = 0;
    let explanation = '';
    let learningStyle = '';
    const scoreMatch = content.match(/Compatibility Score:\s*(\d+)/i);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1], 10);
    }
    // Explanation: capture text between "Explanation:" and "Learning Style:"
    const explanationMatch = content.match(/Explanation:\s*(.*?)(?=Learning Style:)/is);
    if (explanationMatch) {
      explanation = explanationMatch[1].trim();
    } else {
      const altExplanationMatch = content.match(/Explanation:\s*(.*)/is);
      if (altExplanationMatch) {
         explanation = altExplanationMatch[1].trim();
      }
    }
    const lsMatch = content.match(/Learning Style:\s*(auditory|tactile|visual)/i);
    if (lsMatch) {
      learningStyle = lsMatch[1].toLowerCase();
    }
    score = Math.max(0, Math.min(score, 100));
    return { score, explanation, learningStyle };
  }
};

module.exports = learningStyleService;
