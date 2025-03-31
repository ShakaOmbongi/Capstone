'use strict';

const learningStyleService = require('../services/learningStyleService');

const HARD_CODED_QUESTIONS = [
  {
    question: "I follow written directions better than oral directions.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I can remember more about a subject through listening than reading.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I bear down extremely hard when writing.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I like to write things down or take notes for visual review.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I require explanations of graphs, diagrams, or visual directions.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I enjoy working with tools.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I am skillful and enjoy developing and making graphs and charts.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I can tell if sounds match when presented with pairs of sounds.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I remember best by writing things down several times.",
    options: ["Often", "Sometimes", "Seldom"]
  },
  {
    question: "I can understand and follow directions on maps.",
    options: ["Often", "Sometimes", "Seldom"]
  }
];

const learningStyleController = {
  // GET /learning-style/quiz
  getQuizForm: (req, res) => {
    let formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Learning Style Quiz</title>
      </head>
      <body>
        <h1>Learning Style Quiz</h1>
        <form method="POST" action="/learning-style/quiz">
    `;
    HARD_CODED_QUESTIONS.forEach((q, index) => {
      formHtml += `<h3>Question ${index + 1}: ${q.question}</h3>`;
      q.options.forEach(option => {
        formHtml += `
          <label>
            <input type="radio" name="answer${index + 1}" value="${option}" required>
            ${option}
          </label><br>
        `;
      });
    });
    formHtml += `<input type="hidden" name="userId" value="${req.user.id}">`;
    formHtml += `<br><button type="submit">Submit Quiz</button></form></body></html>`;
    res.send(formHtml);
  },

  // POST /learning-style/quiz
  submitQuizForm: async (req, res) => {
    try {
      const userId = req.body.userId;
      const answers = [];
      for (let i = 1; i <= 10; i++) {
        const ans = req.body[`answer${i}`];
        if (!ans) {
          return res.status(400).send(`Missing answer for question ${i}`);
        }
        answers.push(ans);
      }
      await learningStyleService.saveUserResponses(userId, req.user.roleId, answers);
      const matchResult = await learningStyleService.generateMatch(userId);
      
      let resultHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Match Result</title>
        </head>
        <body>
          <h1>Match Result</h1>
      `;
      if (!matchResult.matchUser) {
        resultHtml += `<p>No suitable match found.</p>`;
      } else {
        resultHtml += `<p>Match Score: ${matchResult.score}</p>`;
        resultHtml += `<p>Matched User: ${matchResult.matchUser.username}</p>`;
        resultHtml += `<p>Explanation: ${matchResult.explanation}</p>`;
        resultHtml += `<p>Learning Style: ${matchResult.learning_style || 'N/A'}</p>`;
        
        // Accept Match button with no alert popup
        resultHtml += `
          <button id="acceptMatchBtn">Accept Match</button>
          <script>
            async function acceptMatch() {
              try {
                const res = await fetch('/student/matches/accept', {
                  method: 'POST',
                  credentials: 'include'
                });
                const data = await res.json();
                if (data.status === 'success') {
                  // Instead of alerting, notify the parent window to close the quiz modal
                  window.parent.postMessage('closeQuizModal', '*');
                } else {
                  console.error(data.message || 'Could not accept match');
                }
              } catch (error) {
                console.error('Error accepting match:', error);
              }
            }
            document.getElementById('acceptMatchBtn').addEventListener('click', acceptMatch);
          </script>
        `;
      }
      resultHtml += `</body></html>`;
      res.send(resultHtml);
    } catch (error) {
      res.status(500).send("Error processing quiz: " + error.message);
    }
  },

  // GET /learning-style/taken
  checkQuizStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const quizResponse = await learningStyleService.getLatestUserResponses(userId);
      return res.json({ taken: quizResponse ? true : false });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = learningStyleController;
