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
        
        score = 0;
        currentQuestionIndex = 0;
        scoreHasBeenSaved = false;

        try {
            const response = await fetch(`${BASE_URL}/questions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            currentQuestions = await response.json();
            console.log('Fetched questions:', currentQuestions);
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
        console.log('Displaying question:', question);
    
        // Clear the previous question and options
        questionEl.textContent = '';
        optionsEl.innerHTML = '';
    
        // Set the new question
        questionEl.textContent = question.question;
        
        // Create and append new option buttons
        ['a', 'b', 'c', 'd'].forEach(option => {
            const button = document.createElement('button');
            button.textContent = question[`option_${option}`];
            console.log(`Option ${option}:`, button.textContent);
            button.addEventListener('click', () => selectOption(button));
            optionsEl.appendChild(button);
        });
    
        // Reset selected option
        selectedOption = null;
    
        // Clear any previously selected option styling
        const buttons = optionsEl.getElementsByTagName('button');
        for (let button of buttons) {
            button.style.backgroundColor = '';
        }
    
        console.log('Question updated. Current index:', currentQuestionIndex);
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
        const selectedAnswer = selectedOption.textContent.trim();
        const correctAnswerLetter = question.correct_option.trim();
        
        // Find the index of the correct answer (0 for a, 1 for b, etc.)
        const correctIndex = correctAnswerLetter.charCodeAt(0) - 'a'.charCodeAt(0);
        
        // Get the full text of the correct answer
        const correctAnswer = question[`option_${correctAnswerLetter}`];
    
        console.log('Selected answer:', selectedAnswer);
        console.log('Correct answer:', correctAnswer);
    
        if (selectedAnswer === correctAnswer) {
            score += 10;
            console.log('Correct! New score:', score);
        } else {
            console.log('Incorrect. Score remains:', score);
        }
    
        currentQuestionIndex++;
        showQuestion();
        
        // Update score display
        const currentScoreElement = document.getElementById('currentScore');
        if (currentScoreElement) {
          currentScoreElement.textContent = score;
        } else {
            console.error('currentScore element not found');
    }
    }

    function showResult() {
        quizContainer.style.display = 'none';
        resultEl.style.display = 'block';
        scoreEl.textContent = score;
    }

    async function saveScore() {
        if (scoreHasBeenSaved) {
            alert('Your score has already been saved.');
            return;
        }
    
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
            scoreHasBeenSaved = true;
            
            // Disable the save button
            const saveScoreBtn = document.getElementById('saveScore');
            if (saveScoreBtn) {
                saveScoreBtn.disabled = true;
            }
    
            // Optionally, show a saved message
            const savedMessage = document.getElementById('savedMessage');
            if (savedMessage) {
                savedMessage.style.display = 'block';
            }
    
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
