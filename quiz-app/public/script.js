// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // DOM elements
    const startQuizBtn = document.getElementById('startQuiz');
    const quizContainer = document.getElementById('quizContainer');
    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const submitAnswerBtn = document.getElementById('submitAnswer');
    const resultEl = document.getElementById('result');
    const scoreEl = document.getElementById('score');
    const usernameInput = document.getElementById('username');
    const saveScoreBtn = document.getElementById('saveScore');
    const leaderboardList = document.getElementById('leaderboardList');
    const BASE_URL = 'http://localhost:3000';

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Event listeners
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
        console.log("Start Quiz button event listener added");
    } else {
        console.error("Start Quiz button not found");
    }

    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', submitAnswer);
    }

    if (saveScoreBtn) {
        saveScoreBtn.addEventListener('click', saveScore);
    }

    // Function definitions
    async function startQuiz() {
        console.log("startQuiz function called");
        startQuizBtn.style.display = 'none';
        console.log("Button hidden");
        quizContainer.style.display = 'block';
        console.log("Quiz container shown");
        
        try {
        console.log("Fetching questions...");
        const response = await fetch(`${BASE_URL}/questions`);
        console.log("Response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        currentQuestions = await response.json();
        console.log("Questions data:", currentQuestions);
        showQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

    // Show the current question
    function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionEl.textContent = question.question;
    
    optionsEl.innerHTML = '';
    ['a', 'b', 'c', 'd'].forEach(option => {
        const button = document.createElement('button');
        button.textContent = question[`option_${option}`];
        button.addEventListener('click', () => selectOption(button));
        optionsEl.appendChild(button);
    });
}

    // Handle option selection
    function selectOption(selectedButton) {
    optionsEl.querySelectorAll('button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}

    // Submit the answer
    function submitAnswer() {
    const selectedButton = optionsEl.querySelector('.selected');
    if (!selectedButton) return;
    
    const question = currentQuestions[currentQuestionIndex];
    const selectedOption = selectedButton.textContent;
    
    if (selectedOption === question.correct_option) {
        score++;
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

    // Show the quiz result
    function showResult() {
    quizContainer.style.display = 'none';
    resultEl.style.display = 'block';
    scoreEl.textContent = score;
}

    // Save the score
    async function saveScore() {
    const username = usernameInput.value.trim();
    if (!username) return;
    
    try {
        await fetch('/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, score }),
        });
        
        updateLeaderboard();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

    async function updateLeaderboard() {
    try {
        const response = await fetch(`${BASE_URL}/leaderboard`);
        const leaderboard = await response.json();
        
        leaderboardList.innerHTML = '';
        leaderboard.slice(0, 5).forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.username}: ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

// Initial leaderboard update
updateLeaderboard();
});