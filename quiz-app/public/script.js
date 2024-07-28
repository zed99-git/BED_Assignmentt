document.addEventListener('DOMContentLoaded', () => {
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
    const leaderboardContainer = document.getElementById('leaderboardContainer');

    const BASE_URL = 'http://localhost:3000'; // Update this if your server runs on a different port
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;

    if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz);
    if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', submitAnswer);
    if (saveScoreBtn) saveScoreBtn.addEventListener('click', saveScore);

    async function startQuiz() {
        console.log("startQuiz function called");
        startQuizBtn.style.display = 'none';
        quizContainer.style.display = 'block';
        leaderboardContainer.style.display = 'none';
        
        try {
            const response = await fetch(`${BASE_URL}/questions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            currentQuestions = await response.json();
            showQuestion();
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            showResult();
            return;
        }

        const question = currentQuestions[currentQuestionIndex];
        questionEl.textContent = question.question;
        
        optionsEl.innerHTML = '';
        ['a', 'b', 'c', 'd'].forEach(option => {
            const button = document.createElement('button');
            button.textContent = question[`option_${option}`];
            button.addEventListener('click', () => selectOption(button));
            optionsEl.appendChild(button);
        });

        selectedOption = null; // Reset selected option for new question
    }

    function selectOption(button) {
        // Reset all buttons to default color
        optionsEl.querySelectorAll('button').forEach(btn => {
            btn.style.backgroundColor = '';
        });

        // Set selected button to a different color
        button.style.backgroundColor = '#23405f';
        selectedOption = button;
    }

    function submitAnswer() {
        if (!selectedOption) {
            alert('Please select an answer before submitting.');
            return;
        }

        const question = currentQuestions[currentQuestionIndex];
        if (selectedOption.textContent === question.correct_option) {
            score += 10; // Add 10 points for correct answer
        }

        currentQuestionIndex++;
        showQuestion();
    }

    function showResult() {
        quizContainer.style.display = 'none';
        resultEl.style.display = 'block';
        scoreEl.textContent = score;
    }

    async function saveScore() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter your name before saving the score.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/leaderboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, score }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Score saved successfully!');
            updateLeaderboard();
        } catch (error) {
            console.error('Error saving score:', error);
            alert('Failed to save score. Please try again.');
        }
    }

    async function updateLeaderboard() {
        try {
            const response = await fetch(`${BASE_URL}/leaderboard`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const leaderboard = await response.json();
            
            leaderboardList.innerHTML = '';
            leaderboard.slice(0, 5).forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.username}: ${entry.score}`;
                leaderboardList.appendChild(li);
            });

            // Show the leaderboard after updating it
            leaderboardContainer.style.display = 'block';
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    }

    // Initial leaderboard update
    updateLeaderboard();
});
