// DOM Element References
var startBtn = document.getElementById("start-btn");
var resetBtn = document.getElementById("reset-btn");
var timer = document.getElementById("timer");
var testParagraph = document.getElementById("test-paragraph");
var userInput = document.getElementById("user-input");
var results = document.getElementById("results");
var wordsPerMinute = document.querySelector(".words-per-minute");
// Game State Variables
var timerInterval; // Variable for the setInterval timer
var time = 60; // Starting time for the timer
var gameActive = false; // Boolean to track if the game is currently active
var indexNextSentence = 0;
// List of sentences for the typing test
var testData = [
    "The early bird catches the worm.",
    "A journey of a thousand miles begins with a single step.",
    "Better late than never, but never late is better.",
    "Two wrongs don't make a right.",
    "The pen is mightier than the sword.",
    "When in Rome, do as the Romans.",
    "The squeaky wheel gets the grease.",
    "Fortune favors the bold.",
    "People who live in glass houses should not throw stones.",
    "When the going gets tough, the tough get going.",
    "In our village, folks say God crumbles up the old moon into stars.",
    "One must be careful of books, and what is inside them, for words have the power to change us.",
    "To be fond of dancing was a certain step towards falling in love.",
    "Memory is the diary that we all carry about with us.",
    "There are few people whom I really love, and still fewer of whom I think well.",
    "Life appears to me too short to be spent in nursing animosity or registering wrongs.",
    "I took a deep breath and listened to the old bray of my heart. I am. I am. I am.",
    "There is no greater agony than bearing an untold story inside you.",
    "Beware; for I am fearless, and therefore powerful.",
    "You pierce my soul. I am half agony, half hope.",
    "There is no charm equal to tenderness of heart.",
    "It is a curious thought, but it is only when you see people looking ridiculous that you realize just how much you love them.",
    "Have a heart that never hardens, and a temper that never tires, and a touch that never hurts.",
    "The voice of the sea speaks to the soul.",
    "I am not afraid of storms, for I am learning how to sail my ship.",
    "Every atom of your flesh is as dear to me as my own: in pain and sickness it would still be dear.",
    "With every day, and from both sides of my intelligence, the moral and the intellectual, I thus drew steadily nearer to the truth.",
    "It is a truth universally acknowledged.",
    "To sleep: perchance to dream.",
    "So we beat on, boats against the current.",
    "Heaven knows we need never be ashamed of our tears.",
    "I could easily forgive his pride, if he had not mortified mine.",
    "The world is full of obvious things.",
    "Whatever our souls are made of, his and mine are the same.",
    "Dreams, books, are each a world.",
    "There is no friend as loyal as a book.",
    "Some birds are not meant to be caged.",
    "Every unhappy family is unhappy in its own way.",
    "We live as we dream, alone.",
    "It's no use going back to yesterday.",
    "People disappear when they die.",
    "Beauty is in the eye of the beholder.",
    "All's well that ends well.",
    "Fortune favors the brave.",
    "The best way out is always through.",
    "Time flies over us, but leaves its shadow behind.",
    "To see a world in a grain of sand.",
];
var highScores = [0, 0, 0];
// Load high scores from localStorage (if available)
var storedScores = JSON.parse(localStorage.getItem("highScores") || "[]");
if (Array.isArray(storedScores)) {
    highScores = storedScores;
}
var updateHighScores = function (score) {
    highScores.push(score);
    highScores.sort(function (a, b) { return b - a; });
    highScores = highScores.slice(0, 3);
    localStorage.setItem("highScores", JSON.stringify(highScores));
};
var shuffle = function (array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        _a = [array[randomIndex], array[i]], array[i] = _a[0], array[randomIndex] = _a[1];
    }
};
var totalWordsTyped = 0;
var getWordsPerMinute = function () {
    return totalWordsTyped;
};
var countCorrectWords = function () {
    var _a;
    var testSentenceArray = ((_a = testParagraph.textContent) === null || _a === void 0 ? void 0 : _a.split(" ")) || [];
    var userSentenceArray = userInput.value.split(" ");
    if (time <= 0) {
        totalWordsTyped += userSentenceArray.filter(function (word, i) { return word === testSentenceArray[i]; }).length;
    }
    else {
        totalWordsTyped += testSentenceArray.length;
    }
};
var showResults = function () {
    var wpm = getWordsPerMinute();
    updateHighScores(wpm);
    wordsPerMinute.textContent = "You typed ".concat(wpm, " words per minute!");
    document.querySelectorAll(".high-score").forEach(function (element, i) {
        element.textContent = "".concat(highScores[i], " WPM");
    });
    results.style.display = "flex";
};
var reset = function () {
    clearInterval(timerInterval);
    timerInterval = undefined;
    results.style.display = "none";
    if (gameActive) {
        time = 0;
        countCorrectWords();
        showResults();
    }
    gameActive = false;
    startBtn.disabled = false;
    testParagraph.style.display = "none";
    userInput.disabled = true;
    time = 60;
    timer.textContent = time.toString();
    userInput.value = "";
    userInput.classList.remove("correct-input", "error-input");
    indexNextSentence = 0;
    totalWordsTyped = 0;
};
var updateTimer = function () {
    timer.classList.toggle("animate-timer");
    time--;
    timer.textContent = time.toString();
    if (time <= 0) {
        reset();
    }
};
var checkInputMatch = function () {
    var _a;
    var currentInput = userInput.value;
    var paragraphSegment = ((_a = testParagraph.textContent) === null || _a === void 0 ? void 0 : _a.substring(0, currentInput.length)) || "";
    if (currentInput === paragraphSegment) {
        userInput.classList.remove("error-input");
        userInput.classList.add("correct-input");
    }
    else {
        userInput.classList.remove("correct-input");
        userInput.classList.add("error-input");
    }
    if (userInput.value === testParagraph.textContent) {
        moveToNextSentence();
    }
};
var moveToNextSentence = function () {
    countCorrectWords();
    if (indexNextSentence === testData.length) {
        alert("All sentences completed!");
    }
    else {
        testParagraph.textContent = testData[indexNextSentence];
        userInput.value = "";
        indexNextSentence++;
    }
};
userInput.addEventListener("input", checkInputMatch);
startBtn.addEventListener("click", function () {
    results.style.display = "none";
    shuffle(testData);
    testParagraph.textContent = testData[indexNextSentence];
    indexNextSentence++;
    timerInterval = setInterval(updateTimer, 1000);
    gameActive = true;
    startBtn.disabled = true;
    testParagraph.style.display = "inline";
    userInput.disabled = false;
    userInput.focus();
});
resetBtn.addEventListener("click", reset);
