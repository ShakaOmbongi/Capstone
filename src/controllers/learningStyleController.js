'use strict';

const learningStyleService = require('../services/learningStyleService');
const LearningStyleResponse = require('../entities/LearningStyleResponse');

// Hard-coded 10 questions (same as before)
const HARD_CODED_QUESTIONS = [
  { question: "I follow written directions better than oral directions.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I can remember more about a subject through listening than reading.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I bear down extremely hard when writing.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I like to write things down or take notes for visual review.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I require explanations of graphs, diagrams, or visual directions.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I enjoy working with tools.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I am skillful and enjoy developing and making graphs and charts.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I can tell if sounds match when presented with pairs of sounds.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I remember best by writing things down several times.", options: ["Often", "Sometimes", "Seldom"] },
  { question: "I can understand and follow directions on maps.", options: ["Often", "Sometimes", "Seldom"] }
];

const learningStyleController = {
  // GET /learning-style/quiz – serve the quiz form as HTML fragment
  getQuizForm: (req, res) => {
    let formHtml = `<form method="POST" action="/learning-style/quiz">`;
    HARD_CODED_QUESTIONS.forEach((q, index) => {
      formHtml += `<h3>Question ${index + 1}: ${q.question}</h3>`;
      q.options.forEach(option => {
        formHtml += `
          <label>
            <input type="radio" name="answer${index + 1}" value="${option}" required> ${option}
          </label><br>
        `;
      });
    });
    formHtml += `<input type="hidden" name="userId" value="${req.user.id}">`;
    formHtml += `<br><button type="submit">Submit Quiz</button></form>`;
    res.send(formHtml);
  },

  // POST /learning-style/quiz – process the quiz submission and return match result HTML fragment
  async submitQuizForm(req, res) {
    try {
      const userId = req.body.userId;
      const userRole = req.user.roleId; // numeric value from token
      const answers = [];
      for (let i = 1; i <= 10; i++) {
        const answer = req.body[`answer${i}`];
        if (!answer) return res.status(400).send(`Missing answer for question ${i}`);
        answers.push(answer);
      }
      await learningStyleService.saveUserResponses(userId, userRole, answers);
      const matchResult = await learningStyleService.generateMatch(userId);
      
      let resultHtml = `<h2>Match Result</h2>`;
      if (!matchResult.matchUser) {
        resultHtml += `<p>No suitable match found.</p>`;
      } else {
        resultHtml += `<p>Match Score: ${matchResult.score}</p>`;
        resultHtml += `<p>Matched User: ${matchResult.matchUser.username}</p>`;
        resultHtml += `<p>Explanation: ${matchResult.explanation}</p>`;
      }
      res.send(resultHtml);
    } catch (error) {
      res.status(500).send("Error processing quiz: " + error.message);
    }
  },

  async quizTaken(req, res) {
    try {
      const userId = req.user.id;
      const existingResponse = await LearningStyleResponse.findOne({ where: { userId } });
      res.json({ taken: !!existingResponse });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = learningStyleController;
