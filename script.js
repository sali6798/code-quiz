// ------------ HTML elements ------------
var header = document.querySelector("header");
var leaderboardLink = document.querySelector("#leaderboardLink");
var timerSpan = document.querySelector("#timer");
var titlePageDiv = document.querySelector("#titlePage");
var startBtn = document.querySelector("#start");
var questionsPageDiv = document.querySelector("#questionsPage");
var questionHeading = document.querySelector("#question");
var optionOneBtn = document.querySelector("#optionOne");
var optionTwoBtn = document.querySelector("#optionTwo");
var optionThreeBtn = document.querySelector("#optionThree");
var optionFourBtn = document.querySelector("#optionFour");
var questionResponseDiv = document.querySelector("#questionResponse");
var responseHeading = document.querySelector("#response");
var endPageDiv = document.querySelector("#endPage");
var finalScoreSpan = document.querySelector("#finalScore");
var nameInput = document.querySelector("#name");
var submitBtn = document.querySelector("#submit");
var leaderboardPageDiv = document.querySelector("#leaderboardPage");
var leaderboardTable = document.querySelector("#leaderboard");
var backBtn = document.querySelector("#back");
var clearBtn = document.querySelector("#clear");

var answerButtons = [optionOneBtn, optionTwoBtn, optionThreeBtn, optionFourBtn];
var leaderboardArr = [];

var questionsArr = [
    {"question" : "Where is the deepest part of the ocean?", "answers" : ["Kermadec Trench", "Mariana Trench", "Aleutian Trench", "Manila Trench"], "rightAnswer" : "optionTwo"},
    {"question" : "What is the chemical symbol for silver?", "answers" : ["Ag", "S", "Si", "Au"], "rightAnswer" : "optionOne"},
    {"question" : "Which of these is NOT a Pixar film?", "answers" : ["Ratatouille", "Brave", "Lilo & Stitch", "Up"], "rightAnswer" : "optionThree"},
    {"question" : "Is the answer to life, the universe, and everything:", "answers" : ["Uncertain", "A higher-up existence", "Unanswerable", "42"], "rightAnswer" : "optionFour"},
    {"question" : "What is the currency of Indonesia?", "answers" : ["Rial", "Rupee", "Rupiah", "Ringgit"], "rightAnswer" : "optionThree"}
];
 
var timer = 75;

var pos = 0;

function hideElement(element) {
    element.style.display = "none";
}

function displayElement(element) {
    element.style.display = "block";
}

// clears all rows from the table except the header
function clearTable() {
    for (var i = 1; i < leaderboardTable.rows.length;) {
        leaderboardTable.deleteRow(i);
    }
}

// creates a new cell with content in the row given 
function createCell(row, content) {
    // insert cell at the end of the row
    var cell = row.insertCell();
    cell.textContent = content;
}

// hides all elements except for the leaderboardDiv
function hideAll() {
    header.style.visibility = "hidden";
    hideElement(titlePageDiv);
    hideElement(questionsPageDiv);
    hideElement(questionResponseDiv);
    hideElement(endPageDiv);
}

// displays the leaderboard from highest to lowest
function displayLeaderboard() { 
    hideAll();
    clearTable();
    displayElement(leaderboardPageDiv);

    if (leaderboardArr.length > 0) {
        // sorts the leaderboardArr from highest 
        // to lowest by score
        leaderboardArr.sort((a, b) => b.score - a.score);

        var rank = 1;

        // for each element create a new row in leaderboardTable
        for (var i = 0; i < leaderboardArr.length; i++) {
            var curr = leaderboardArr[i];
            // insert row at the bottom of the table
            var row = leaderboardTable.insertRow();
            

            // checks if the score is already on the leaderboard so if it 
            // is everyone of that score has the same rank
            if (i !== 0 && curr.score !== leaderboardArr[i - 1].score) {
                rank++;
            }

            // create cell data for each heading in the table
            createCell(row, rank);
            createCell(row, curr.name);
            createCell(row, curr.score);
        }
    }
}

// highlights the score of the user playing when the
// leaderboard is displayed after the name submisson
function highlightUserScore(user) {
    // searches the table rows for the entry that matches the user
    for (var i = 1; i < leaderboardTable.rows.length; i++) {
        var r = leaderboardTable.rows[i];
        var c = r.cells;
        if (c[1].textContent === user.name && parseInt(c[2].textContent) === user.score) {
            r.style.fontWeight = "bold";
            r.style.background = "rgb(50, 119, 76)";
            break;
        }
    }
}

// adds a new object with the users name and score to the leaderboardArr
function addScore() {
    var input = nameInput.value;

    var user = {name: input, score: timer};
    // add new score to array
    leaderboardArr.push({name: input, score: timer});

    // updates array in local storage
    localStorage.setItem("leaderboard", JSON.stringify(leaderboardArr));

    hideElement(endPageDiv);
    displayLeaderboard();
    highlightUserScore(user);
}

// clears all the scores and resets leaderboarArr and localStorage
function clearLeaderboard() {
    leaderboardArr = [];
    localStorage.clear();
    displayLeaderboard();
}

// displays the question and the buttons with the choices
function displayQuestion() {
    var currentQuestion = questionsArr[pos];
    questionHeading.textContent = currentQuestion.question;
    for (var i = 0; i < answerButtons.length; i++) {
        answerButtons[i].textContent = currentQuestion.answers[i];
    }
}

// checks if the answer chosen was correct and displays response
function isCorrectAnswer(event) {
    // compares if the id of the button is the same as the rightAnswer value
    if (event.target.id === questionsArr[pos].rightAnswer) {
        responseHeading.textContent = "Correct!";
        isCorrect = true;
    }
    else {
        // takes 10 seconds off the timer if incorrect
        timer -= 10;
        responseHeading.textContent = "Wrong!";
    }
    displayElement(questionResponseDiv);
    
    // display response for 300 milliseconds
    setTimeout(function() {
        hideElement(questionResponseDiv);
        pos++;
        if (pos < questionsArr.length) {
            displayQuestion();
        }
    }, 300);
}

// starts the timer when quiz is started
function startTimer() {
    displayElement(questionsPageDiv);
    timerSpan.textContent = timer;
    displayQuestion();

    var timerInterval = setInterval(function() {
        // checks every millisecond, or else doesn't display  
        // end page fast enough when condition is true
        var checkInterval = setInterval(function() {
            if (questionsPageDiv.style.display === 'none') {
                clearInterval(checkInterval);
                clearInterval(timerInterval);
            }
            else if (timer === 0 || pos === questionsArr.length) {
                clearInterval(checkInterval);
                clearInterval(timerInterval);
                hideElement(questionsPageDiv);
                finalScoreSpan.textContent = timer;
                displayElement(endPageDiv);
            }
            timerSpan.textContent = timer;
        }, 1);

        if (timer !== 0 || pos !== questionsArr.length ) {
            timer--;
        }
    }, 1000);
}

// reset timer and question position to initial values 
// and return to the title page
function restart() {
    timer = 75;
    timerSpan.textContent = 0;
    pos = 0;
    hideElement(leaderboardPageDiv);
    header.style.visibility = "visible";
    displayElement(titlePageDiv);
}

// retrieve leaderboard from local storage if it exists
function init() {
    var savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (savedLeaderboard === null) {
        return;
    }
    else {
        leaderboardArr = savedLeaderboard;
    }   
}

// -------------- EVENT LISTENERS --------------
leaderboardLink.addEventListener("click", displayLeaderboard)
startBtn.addEventListener("click", function() {
    hideElement(titlePageDiv);
    startTimer();
});
optionOneBtn.addEventListener("click", isCorrectAnswer);
optionTwoBtn.addEventListener("click", isCorrectAnswer);
optionThreeBtn.addEventListener("click", isCorrectAnswer);
optionFourBtn.addEventListener("click", isCorrectAnswer);
submitBtn.addEventListener("click", addScore);
// if someone wants to sumbit their name by pressing enter
nameInput.addEventListener("keyup", function(event) {
    // keyCode for enter
    if (event.keyCode === 13) {
        addScore();
    }
});
backBtn.addEventListener("click", restart);
clearBtn.addEventListener("click", clearLeaderboard);

init();