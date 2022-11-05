const questions = [
    {
        questionText: "Commonly used data types DO NOT include:",
        options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
        answer: "3. alerts",
    },
    {
        questionText: "Arrays in JavaScript can be used to store ______.",
        options: [
            "1. numbers and strings",
            "2. other arrays",
            "3. booleans",
            "4. all of the above",
        ],
        answer: "4. all of the above",
    },
    {
        questionText:
            "String values must be enclosed within _____ when being assigned to variables.",
        options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
        answer: "3. quotes",
    },
    {
        questionText:
            "A very useful tool used during development and debugging for printing content to the debugger is:",
        options: [
            "1. JavaScript",
            "2. terminal/bash",
            "3. for loops",
            "4. console.log",
        ],
        answer: "4. console.log",
    },
    {
        questionText:
            "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
        options: ["1. break", "2. stop", "3. halt", "4. exit"],
        answer: "1. break",
    },
];


// App logic

// select elements
const leaderBoard = document.querySelector('#leaderboard');
const timer = document.querySelector('#timer');
console.log(timer)
const startBtn = document.querySelector(".start-btn");
const container = document.querySelector('.container');
const startContainer = document.querySelector('#start-container');
const questionContainer = document.querySelector('#question-container');
console.log(questionContainer)
const rule = document.querySelector('.rule');
const answer = document.querySelector('.answer');
let initialInput;
let initialSubmitBtn;



// state variables  : score, highscores etc
let currQuestionNum = 0;
const maxQuestions = questions.length;
let score = 0;
let highscores = [];
let questionDisplayed = false;
const correctAnswer = "Correct!";
const incorrectAnswer = "Incorrect!";
let remTime = 50; // seconds
let timerId;
let initial = '';
let allDoneDisplayed = false;



// load highscores from local storage
const localHighScores = localStorage.getItem('highscores');
if (localHighScores) {
    highscores = JSON.parse(localHighScores);
}
// console.log(highscores)

const selectElementsFromHighscores = ()=>{
    const highscoresContainer = document.querySelector('.highscores');
    const backBtn = document.querySelector('#backBtn');
    const clearHighscores = document.querySelector('#clearHighscores');

    const updateUI = ()=>{
        remTime = 50;
        score = 0;
        currQuestionNum = 0;
        allDoneDisplayed = false;
        timer.classList.add('invisible');
        highscoresContainer.classList.add('hidden');
        startContainer.classList.remove('hidden');
    }

    backBtn.addEventListener('click', (e) => {
        updateUI();
    })

    clearHighscores.addEventListener('click', (e) => {
        localStorage.removeItem('highscores');
        highscores = [];
        updateUI();
    })
}

const showHighscores = () => {
    let highscoreHtml = `<div class="highscores">
    <h2>Highscores</h2>
    ${highscores.map((obj, i)=> `<p>${i+1}. ${obj.initial} - ${obj.score}</p>`).join(' ')}
    <button class="btn" id="backBtn">Go Back</button>
    <button class="btn" id="clearHighscores">Clear Highscores</button>
    </div>`
    // container.innerHTML = ""
    startContainer.classList.add('hidden')
    container.insertAdjacentHTML('afterbegin', highscoreHtml)
    
    selectElementsFromHighscores();
}

leaderBoard.addEventListener('click', (e) => {

    showHighscores();
})

// select elements from allDone container after its displayed
const selectElements = () => {
    initialInput = document.querySelector('#initial-input');
    initialSubmitBtn = document.querySelector('#initial-submit');

    initialSubmitBtn.addEventListener('click', function (e) {
        initial = initialInput.value
        console.log(initial)
        if (initial) {
            highscores.push({ initial: initial.toUpperCase(), score });
            highscores.sort((a, b) => a.score - b.score <= 0)
            localStorage.setItem('highscores', JSON.stringify(highscores));
            const allDoneContainer = document.querySelector('.all-done');
            // allDoneContainer.classList.
            container.removeChild(allDoneContainer);
            showHighscores();
        }
    })
}

// when quiz finishes or timer reaches 0 display all done container
const displayAllDone = () => {
    if (!allDoneDisplayed) {
        allDoneDisplayed = true;
        questionContainer.classList.add('hidden');
        const allDone = `            <div class="all-done">
        <h2>All done!</h2>
        <p>Your final score is <span>${score}</span>.</p>
        <p>Enter initials: <input type="text" id="initial-input" value=""> <button class="btn" id="initial-submit">Submit</button></p>
        </div>`
        container.insertAdjacentHTML('afterbegin', allDone);
        selectElements();
    }

}

const displayQuestion = () => {

    rule.classList.add('hidden');
    answer.classList.add('hidden');
    if (currQuestionNum < maxQuestions) {
        let currQues = questions[currQuestionNum];

        questionContainer.querySelector('h2').textContent = currQues.questionText;

        // option 1    
        questionContainer.querySelector('#option-1').textContent = currQues.options[0];
        // option 2    
        questionContainer.querySelector('#option-2').textContent = currQues.options[1];
        // option 3    
        questionContainer.querySelector('#option-3').textContent = currQues.options[2];
        // option 4    
        questionContainer.querySelector('#option-4').textContent = currQues.options[3];
    } else {
        // disply all done page with score
        clearInterval(timerId)
        // score = remTime;
        displayAllDone()

    }
}

const updateTime = (currTime = -1) => {
    timer.textContent = remTime;
    // decrease 1  second from remTime
    score = remTime;
    if (currTime === 10) {
        remTime -= 10;
        score = remTime;
        if (remTime >= 0)
            timer.textContent = remTime;
        else {
            timer.textContent = 0;
            // score = 0;
            // displayAllDone(0);
        }

    } else
        remTime--;
    if (remTime <= 0) {
        score = 0;
        clearInterval(timerId);
        displayAllDone(0);
    }
};

const startQuizTimer = () => {

    // remTime = 50;
    updateTime();
    timerId = setInterval(updateTime, 1000);
    return timerId;
}

startBtn.addEventListener("click", (e) => {
    questionDisplayed = true;
    startContainer.classList.add('hidden')
    questionContainer.classList.remove('hidden');
    displayQuestion();
    timer.classList.remove('invisible')
    timerId = startQuizTimer()
})


questionContainer.addEventListener('click', function (e) {

    let option = e.target.getAttribute('id');
    // console.log(e.target.getAttribute('id'))
    if (option === 'option-1' || option === 'option-2' || option === 'option-3' || option === 'option-4') {
        if (e.target.textContent === questions[currQuestionNum].answer) {
            answer.textContent = correctAnswer;
        } else {
            answer.textContent = incorrectAnswer;
            updateTime(10)
        }
        rule.classList.remove('hidden');
        answer.classList.remove('hidden');
        currQuestionNum++;
        setTimeout(() => {
            displayQuestion();
        }, 100);

    }
    // console.log(e.target.textContent)
    // console.log(e.currentTarget)
})

