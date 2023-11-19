// DOM Element References
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const timer = document.getElementById("timer") as HTMLDivElement;
const testParagraph = document.getElementById(
  "test-paragraph"
) as HTMLParagraphElement;
const userInput = document.getElementById("user-input") as HTMLTextAreaElement;
const results = document.getElementById("results") as HTMLDivElement;
const wordsPerMinute = document.querySelector(
  ".words-per-minute"
) as HTMLSpanElement;

// Game State Variables
let timerInterval: number | undefined; // Variable for the setInterval timer
let time: number = 60; // Starting time for the timer
let gameActive: boolean = false; // Boolean to track if the game is currently active
let indexNextSentence: number = 0;

// List of sentences for the typing test
const testData: string[] = [
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

let highScores: number[] = [0, 0, 0];

// Load high scores from localStorage (if available)
const storedScores = JSON.parse(localStorage.getItem("highScores") || "[]");
if (Array.isArray(storedScores)) {
  highScores = storedScores;
}

const updateHighScores = (score: number): void => {
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 3);
  localStorage.setItem("highScores", JSON.stringify(highScores));
};

const shuffle = (array: string[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
};

let totalWordsTyped: number = 0;

const getWordsPerMinute = (): number => {
  return totalWordsTyped;
};

const countCorrectWords = (): void => {
  const testSentenceArray = testParagraph.textContent?.split(" ") || [];
  const userSentenceArray = userInput.value.split(" ");
  if (time <= 0) {
    totalWordsTyped += userSentenceArray.filter(
      (word, i) => word === testSentenceArray[i]
    ).length;
  } else {
    totalWordsTyped += testSentenceArray.length;
  }
};

const showResults = (): void => {
  const wpm = getWordsPerMinute();
  updateHighScores(wpm);
  wordsPerMinute.textContent = `You typed ${wpm} words per minute!`;
  document.querySelectorAll(".high-score").forEach((element, i) => {
    (element as HTMLDivElement).textContent = `${highScores[i]} WPM`;
  });
  results.style.display = "flex";
};

const reset = (): void => {
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

const updateTimer = (): void => {
  timer.classList.toggle("animate-timer");
  time--;
  timer.textContent = time.toString();
  if (time <= 0) {
    reset();
  }
};

const checkInputMatch = (): void => {
  const currentInput = userInput.value;
  const paragraphSegment =
    testParagraph.textContent?.substring(0, currentInput.length) || "";

  if (currentInput === paragraphSegment) {
    userInput.classList.remove("error-input");
    userInput.classList.add("correct-input");
  } else {
    userInput.classList.remove("correct-input");
    userInput.classList.add("error-input");
  }

  if (userInput.value === testParagraph.textContent) {
    moveToNextSentence();
  }
};

const moveToNextSentence = (): void => {
  countCorrectWords();
  if (indexNextSentence === testData.length) {
    alert("All sentences completed!");
  } else {
    testParagraph.textContent = testData[indexNextSentence];
    userInput.value = "";
    indexNextSentence++;
  }
};

userInput.addEventListener("input", checkInputMatch);
startBtn.addEventListener("click", () => {
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
