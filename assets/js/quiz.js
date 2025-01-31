document.addEventListener("DOMContentLoaded", function() {
    const questions = [
        { 
            question: "How do you prefer to study?",
            options: ["Reading textbooks", "Watching videos", "Group discussions", "Hands-on practice"]
        },
        { 
            question: "What helps you remember information best?",
            options: ["Writing notes", "Listening to explanations", "Explaining to others", "Doing practical exercises"]
        },
        { 
            question: "Which describes you best?",
            options: ["I like structure and organization", "I prefer flexibility and creativity", "I learn best with others", "I need step-by-step guidance"]
        },
        { 
            question: "How do you handle problem-solving?",
            options: ["Research first", "Ask someone for help", "Work in a team", "Experiment until I get it"]
        },
        { 
            question: "Which learning method do you enjoy the most?",
            options: ["Lectures and reading", "Multimedia like videos", "Discussions and interactions", "Hands-on activities"]
        }
    ];

    let currentQuestionIndex = 0;
    let selectedAnswers = [];

    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextButton = document.getElementById("next-btn");
    const currentQuestion = document.getElementById("current-question");
    const totalQuestions = document.getElementById("total-questions");

    totalQuestions.textContent = questions.length;

    function loadQuestion(index) {
        const question = questions[index];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = "";

        question.options.forEach((option, i) => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("option");
            optionElement.textContent = option;
            optionElement.addEventListener("click", () => selectOption(optionElement, option));
            optionsContainer.appendChild(optionElement);
        });

        nextButton.disabled = true;
        currentQuestion.textContent = index + 1;
    }

    function selectOption(optionElement, answer) {
        document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
        optionElement.classList.add("selected");
        selectedAnswers[currentQuestionIndex] = answer;
        nextButton.disabled = false;
    }

    nextButton.addEventListener("click", function() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            determineLearningStyle();
        }
    });

    function determineLearningStyle() {
        const results = { 
            Visual: 0, 
            Auditory: 0, 
            Social: 0, 
            Kinesthetic: 0 
        };

        selectedAnswers.forEach(answer => {
            if (["Reading textbooks", "Writing notes", "Lectures and reading"].includes(answer)) results.Visual++;
            if (["Watching videos", "Listening to explanations", "Multimedia like videos"].includes(answer)) results.Auditory++;
            if (["Group discussions", "Explaining to others", "Discussions and interactions"].includes(answer)) results.Social++;
            if (["Hands-on practice", "Doing practical exercises", "Experiment until I get it"].includes(answer)) results.Kinesthetic++;
        });

        let highestType = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

        alert(`Your learning style is: ${highestType}`);
        window.location.href = "student-dashboard.html"; // Redirect after quiz completion
    }

    loadQuestion(currentQuestionIndex);
});
