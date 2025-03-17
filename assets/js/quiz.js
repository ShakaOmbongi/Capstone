document.addEventListener("DOMContentLoaded", function() {
    const questions = [
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
            Kinesthetic: 0 
        };

        selectedAnswers.forEach(answer => {
            if (["Often"].includes(answer)) results.Visual++;
            if (["Sometimes"].includes(answer)) results.Auditory++;
            if (["Seldom"].includes(answer)) results.Kinesthetic++;
        });

        let highestType = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

        alert(`Your learning style is: ${highestType}`);
        window.location.href = "studentdashboard.html"; // Redirect after quiz completion
    }

    loadQuestion(currentQuestionIndex);

    // Citation for the questions
    const citation = document.createElement("p");
    citation.innerHTML = 'Questions sourced from the <a href="https://secure.studentachievement.colostate.edu/learningstyles/quiz.aspx" target="_blank">Collaborative for Student Achievement - Colorado State University</a>.';
    document.body.appendChild(citation);
});
