'use strict';
const axios = require('axios');

/**
 * 1) Sign Up
 */
async function signup() {
  try {
    const response = await axios.post('http://127.0.0.1:3000/signup', {
      username: 'testtutor1',
      email: 'testtutor1@example.com',
      password: 'testtutor1',
      roleId: 'tutor'
    });
    console.log('Signup response:', response.data);
  } catch (error) {
    console.error('Error during signup:', error.response?.data || error.message);
  }
}

/**
 * 2) Log In and Retrieve JWT
 */
async function login() {
  try {
    const response = await axios.post('http://127.0.0.1:3000/login', {
      username: 'testtutor1',
      password: 'testtutor1'
    });
    console.log('Login response:', response.data);
    return response.data.access_token; // We'll use this token for further requests
  } catch (error) {
    console.error('Error during login:', error.response?.data || error.message);
  }
}

/**
 * 3) Fetch Quiz Questions
 */
async function getQuizQuestions(token) {
  try {
    const response = await axios.get('http://127.0.0.1:3000/quiz-questions', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Quiz questions:', response.data);
  } catch (error) {
    console.error('Error fetching quiz questions:', error.response?.data || error.message);
  }
}

/**
 * 4) Submit Quiz Answers
 * Must be exactly 10 answers
 */
async function submitQuiz(token) {
  try {
    const answers = [
      "Often",
      "Sometimes",
      "Seldom",
      "Often",
      "Sometimes",
      "Seldom",
      "Often",
      "Sometimes",
      "Seldom",
      "Often"
    ];
    const response = await axios.post('http://127.0.0.1:3000/quiz', {
      answers: answers
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Quiz submission response:', response.data);
  } catch (error) {
    console.error('Error submitting quiz:', error.response?.data || error.message);
  }
}

/**
 * 5) Generate Matches
 */
async function generateMatches(token) {
  try {
    // Some code uses POST /generate-matches, some code uses GET. 
    // If your code is a POST with no body:
    const response = await axios.post(
      'http://127.0.0.1:3000/generate-matches',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Generate matches response:', response.data);
  } catch (error) {
    console.error('Error generating matches:', error.response?.data || error.message);
  }
}

/**
 * Main Orchestrator
 */
async function main() {
  // 1) Sign up
  await signup();
  
  // 2) Log in
  const token = await login();
  if (!token) return;
  
  // 3) Get quiz questions
  await getQuizQuestions(token);
  
  // 4) Submit quiz
  await submitQuiz(token);
  
  // 5) Generate matches
  await generateMatches(token);
}

// Run
main();
