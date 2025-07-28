const { useState, useEffect } = React;

const QuizContainer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const handleAnswerSubmit = (questionId, userAnswer, isCorrect) => {
    const wasAlreadyCorrect = answers[questionId]?.isCorrect;

    const newAnswers = {
      ...answers,
      [questionId]: {
        userAnswer,
        isCorrect,
        attempts: (answers[questionId]?.attempts || 0) + 1,
      },
    };

    setAnswers(newAnswers);

    // Добавляем вопрос в список отвеченных
    setAnsweredQuestions((prev) => new Set([...prev, questionId]));

    // Обновляем счет только если ответ правильный и раньше не был правильным
    if (isCorrect && !wasAlreadyCorrect) {
      setScore(score + 1);
    } else if (!isCorrect && wasAlreadyCorrect) {
      setScore(score - 1);
    }

    // Не делаем автоматический переход - пользователь сам управляет навигацией
  };

  const goToNextQuestion = () => {
    if (currentQuestion < window.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  const finishQuiz = () => {
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  if (isCompleted) {
    return React.createElement(window.ResultsDisplay, {
      answers: answers,
      questions: window.questions,
      score: score,
      onRestart: resetQuiz,
    });
  }

  return React.createElement(
    "div",
    { className: "quiz-container" },
    React.createElement(window.ProgressIndicator, {
      current: currentQuestion + 1,
      total: window.questions.length,
      answeredQuestions: answeredQuestions,
      onQuestionClick: goToQuestion,
    }),
    React.createElement(window.QuestionComponent, {
      question: window.questions[currentQuestion],
      onAnswerSubmit: handleAnswerSubmit,
      previousAnswer:
        answers[window.questions[currentQuestion].id]?.userAnswer || "",
    }),
    React.createElement(
      "div",
      { className: "navigation-controls" },
      React.createElement(
        "button",
        {
          onClick: goToPreviousQuestion,
          disabled: currentQuestion === 0,
          className: "nav-button prev-button",
        },
        "← Предыдущий"
      ),
      React.createElement(
        "span",
        { className: "question-counter" },
        `Вопрос ${currentQuestion + 1} из ${window.questions.length}`
      ),
      // На последнем вопросе показываем кнопку завершения вместо "Следующий"
      currentQuestion === window.questions.length - 1 
        ? React.createElement(
            "button",
            {
              onClick: finishQuiz,
              className: "finish-button",
            },
            "Завершить проверку"
          )
        : React.createElement(
            "button",
            {
              onClick: goToNextQuestion,
              className: "nav-button next-button",
            },
            "Следующий →"
          )
    )
  );
};

window.QuizContainer = QuizContainer;
