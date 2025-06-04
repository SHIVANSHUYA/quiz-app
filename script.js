// Firebase configuration (Replace with your own)
const firebaseConfig = { 
  apiKey: "AIzaSyBBW5dNGI5U3paWofjxXRQfxdX0y37yj1c",
  authDomain: "quiz-app-661e5.firebaseapp.com",
  projectId: "quiz-app-661e5",
  storageBucket: "quiz-app-661e5.firebasestorage.app",
  messagingSenderId: "33605113425",
  appId: "1:33605113425:web:496af0c2ebda49db9e4a70"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get references to elements
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const studentInfo = document.getElementById("student-info");
const finalScore = document.getElementById("final-score");
const finishBtn = document.getElementById("finish-btn");
const nextBtn = document.getElementById("next-btn");

// Store student information and score
let studentData = {
  name: "",
  studentClass: "",
  section: "",
  score: 0
};

// Question data
const correctAnswers = { q1: "Paris" };
let currentQuestionIndex = 0;

// Start quiz function
startBtn.addEventListener("click", () => {
  // Get student data from the form
  studentData.name = document.getElementById("student-name").value;
  studentData.studentClass = document.getElementById("student-class").value;
  studentData.section = document.getElementById("student-section").value;

  // Ensure all fields are filled
  if (!studentData.name || !studentData.studentClass || !studentData.section) {
    alert("Please fill all the fields!");
    return;
  }

  // Hide start screen and show quiz container
  startScreen.classList.remove("active");
  quizContainer.classList.add("active");
  showQuestion(currentQuestionIndex);
});

// Show a question
function showQuestion(index) {
  const questionText = document.getElementById("question-text");
  if (index === 0) {
    questionText.textContent = "What is the capital of France?";
  }
}

// Handle Next button click
nextBtn.addEventListener("click", () => {
  const selectedOption = document.querySelector('input[name="q1"]:checked');
  if (selectedOption && selectedOption.value === correctAnswers.q1) {
    studentData.score++;
  }

  // Move to the next question or end the quiz
  currentQuestionIndex++;
  if (currentQuestionIndex === 1) {
    showEndScreen();
  } else {
    showQuestion(currentQuestionIndex);
  }
});

// Show end screen
function showEndScreen() {
  quizContainer.classList.remove("active");
  endScreen.classList.add("active");

  // Show student info and score
  studentInfo.textContent = studentData.name;
  finalScore.textContent = studentData.score;

  // Upload result to Firebase
  uploadResult();
}

// Finish button to reload the page
finishBtn.addEventListener("click", () => {
  window.location.reload();
});

// Function to upload result to Firebase
function uploadResult() {
  db.collection("quizResults").add({
    name: studentData.name,
    studentClass: studentData.studentClass,
    section: studentData.section,
    score: studentData.score,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    alert("Failed to submit results. Please check your Firestore configuration and try again.");
  });
}
