"use strict";

const startBtn = document.getElementById("start-btn");
const timer = document.getElementById("timer");
const testParagraph = document.getElementById("test-paragraph");
const userInput = document.getElementById("user-input");
let timerInterval;
let time = 59;
let gameActive = false;
const testData = [
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
];
let mistake = 0;
let correct = 0;

const shuffle = (array) => {
  // Iterate through the array backwards
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Store the value at index i in a temporary variable
    let temp = array[i];
    // Swap the value at index i with the value at the random index
    array[i] = array[randomIndex];
    // Set the value at the random index to the temporary variable
    array[randomIndex] = temp;
  }
};

const reset = () => {
  clearInterval(timerInterval);
  gameActive = false;
  calculateAccuracy(testParagraph.textContent, userInput.value, true);
  console.log(mistake, correct);
};

const updateTimer = () => {
  timer.classList.toggle("animate-timer");
  timer.textContent = time;
  time--;
  if (time < 0) {
    reset();
  }
};

const checkInputMatch = () => {
  // Get the current text in the input
  const currentInput = userInput.value;
  console.log(currentInput);
  // Get the respective part of the paragraph
  const paragraphSegment = testParagraph.textContent.substring(
    0,
    currentInput.length
  );

  if (currentInput === paragraphSegment) {
    userInput.classList.remove("error-input");
    userInput.classList.add("correct-input");
  } else {
    userInput.classList.remove("correct-input");
    userInput.classList.add("error-input");
  }
};

const calculateAccuracy = (
  testSentence,
  userSentence,
  isFinalCheck = false
) => {
  const testSentenceArray = testSentence.split(" ");
  const userSentenceArray = userSentence.split(" ");

  if (isFinalCheck) {
    userSentenceArray.pop();
  }

  let length = userSentenceArray.length;
  for (let i = 0; i < length; i++) {
    if (testSentenceArray[i] !== userSentenceArray[i]) {
      mistake++;
    } else {
      correct++;
    }
  }

  if (!isFinalCheck) {
    mistake += Math.abs(testSentenceArray.length - userSentenceArray.length);
  }
};

let indexNextSentence = 0;
const moveToNextSentence = () => {
  if (indexNextSentence === testData.length) {
    reset();
    alert("All sentences completed!");
  } else {
    calculateAccuracy(testParagraph.textContent, userInput.value);
    console.log(mistake, correct);
    // Load the next sentence

    testParagraph.textContent = testData[indexNextSentence];
    userInput.value = ""; // Clear the input for the next sentence
    indexNextSentence++;
  }
};

let hasPressedEnterOnce = false;
// Add an event listener to check every time the input changes
userInput.addEventListener("input", () => {
  checkInputMatch();
  if (userInput.value === testParagraph.textContent) {
    moveToNextSentence();
    hasPressedEnterOnce = false; // Reset the flag, as we're moving to the next sentence
  }
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gameActive) {
    if (hasPressedEnterOnce) {
      moveToNextSentence();
      hasPressedEnterOnce = false; // Reset the flag after moving to the next sentence
    } else {
      hasPressedEnterOnce = true; // Set the flag indicating the user has pressed Enter once
    }
  }
});

startBtn.addEventListener("click", () => {
  timerInterval = setInterval(updateTimer, 1000);
  gameActive = true;
  startBtn.disabled = true;
  testParagraph.style.display = "inline";
  userInput.disabled = false;
  userInput.focus();
});
