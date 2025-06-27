const modal = document.getElementById("score-modal");
const scoreMessage = document.getElementById("score-message");
const playAgainButton = document.getElementById("play-again");
const reviewContainer = document.getElementById("review-container");
let incorrectAnswers = [];

const questions = [
  {
    question: "How many time zones are there in Russia?",
    answers: [
      { text: "6", correct: false },
      { text: "11", correct: true },
      { text: "9", correct: false },
      { text: "13", correct: false },
    ],
  },
  {
    question: "What's the national flower of Japan?",
    answers: [
      { text: "Iris", correct: false },
      { text: "Ume", correct: false },
      { text: "Sakura", correct: true },
      { text: "Higanbana", correct: false },
    ],
  },
  {
    question: "Which ocean is the largest?",
    answers: [
      { text: "Atlantic", correct: false },
      { text: "Indian", correct: false },
      { text: "Pacific", correct: true },
      { text: "Arctic", correct: false },
    ],
  },
  {
    question: "Who discovered Penicillin?",
    answers: [
      { text: "Marie Curie", correct: false },
      { text: "Alexander Fleming", correct: true },
      { text: "Isaac Newton", correct: false },
      { text: "Albert Einstein", correct: false },
    ],
  },
  {
    question: "Which planet has the most moons?",
    answers: [
      { text: "Earth", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: true },
      { text: "Mars", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-btns");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let questionTimer;
let timeLeft = 10;

function startCountdown() {
  document.getElementById("welcome-screen").classList.add("hidden");


  const countdownScreen = document.getElementById("countdown-screen");
  countdownScreen.classList.remove("hidden");

  let count = 3;
  const countdownText = document.getElementById("countdown-text");
  countdownText.textContent = count;

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownText.textContent = count;
    } else {
      countdownText.textContent = "Go!";
    }

    if (count < 0) {
      clearInterval(interval);
      countdownScreen.classList.add("hidden");
      document.getElementById("app").style.display = "block";
      startQuiz();
    }
  }, 1000);
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  incorrectAnswers = [];
  document.getElementById("quiz-screen").style.display = "block";
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.className =
      "w-full text-left px-4 py-2 my-2 rounded-full border border-[#232d4b] bg-[#eaebfe] text-[#022954] font-semibold transition hover:scale-105 hover:bg-[#dbe0f5]";
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });

  startQuestionTimer();
}

function resetState() {
  nextButton.style.display = "none";
  resetQuestionTimer();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    score++;
    selectedBtn.classList.add("bg-green-400", "text-white");
  } else {
    selectedBtn.classList.add("bg-red-400", "text-white");
    const currentQuestion = questions[currentQuestionIndex];
    incorrectAnswers.push({
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answers.find((ans) => ans.correct).text,
    });
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("bg-green-400", "text-white");
    }
    button.disabled = true;
  });

  clearInterval(questionTimer);
  nextButton.style.display = "block";
}

function showScore() {
  document.getElementById("quiz-screen").style.display = "none";
  modal.classList.remove("hidden");

  let message = `You scored ${score} out of ${questions.length}`;
  if (score === questions.length) {
    message += " 🎉 Perfect!";
  } else if (score >= questions.length / 2) {
    message += " 👍 Great job!";
  } else {
    message += " 📘 Keep practicing!";
  }
  scoreMessage.innerHTML = message;

  reviewContainer.innerHTML = "";
  if (incorrectAnswers.length > 0) {
    const reviewTitle = document.createElement("h3");
    reviewTitle.className = "text-lg font-semibold mb-2 text-[#022954]";
    reviewTitle.textContent = "Review:";
    reviewContainer.appendChild(reviewTitle);

    incorrectAnswers.forEach((item) => {
      const div = document.createElement("div");
      div.className = "mb-2 text-left text-sm";
      div.innerHTML = `<strong>Q:</strong> ${item.question}<br/><strong>Answer:</strong> ${item.correctAnswer}`;
      reviewContainer.appendChild(div);
    });
  }
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

function startQuestionTimer() {
  const timerDisplay = document.getElementById("question-timer");
  timeLeft = 10;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;

  questionTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      autoSkipQuestion();
    }
  }, 1000);
}

function resetQuestionTimer() {
  clearInterval(questionTimer);
  document.getElementById("question-timer").textContent = "";
}

function autoSkipQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  incorrectAnswers.push({
    question: currentQuestion.question,
    correctAnswer: currentQuestion.answers.find((ans) => ans.correct).text,
  });

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("bg-green-400", "text-white");
    } else {
      button.classList.add("opacity-50");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

playAgainButton.addEventListener("click", () => {
  modal.classList.add("hidden");
  startCountdown();
});

document.getElementById("start-btn").addEventListener("click", startCountdown);
