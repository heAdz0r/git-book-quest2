const { useState } = React;

const QuestionComponent = ({ question, onAnswerSubmit, previousAnswer }) => {
  const [userAnswer, setUserAnswer] = useState(previousAnswer || "");
  const [showHint, setShowHint] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);

  // Check if required functions are loaded on mount
  React.useEffect(() => {
    console.log("QuestionComponent mounted for question", question.id);
    console.log("Functions available:", {
      encryptedAnswers: !!window.encryptedAnswers,
      validateAnswer: !!window.validateAnswer,
      getAnswerHash: !!window.getAnswerHash,
    });
  }, []);

  // Update input when question changes
  React.useEffect(() => {
    setUserAnswer(previousAnswer || "");
    setAnswerStatus(null);
    setShowHint(false);
  }, [question.id]);

  // Update input when previousAnswer changes (but don't reset status)
  React.useEffect(() => {
    if (previousAnswer !== undefined) {
      setUserAnswer(previousAnswer);
    }
  }, [previousAnswer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userAnswer.trim()) {
      setAnswerStatus("empty");
      return;
    }

    const performValidation = () => {
      try {
        // Проверяем доступность функций
        if (!window.encryptedAnswers) {
          console.error("window.encryptedAnswers не загружен");
          // Попробуем еще раз через 100ms
          setTimeout(performValidation, 100);
          return;
        }

        if (!window.validateAnswer) {
          console.error("window.validateAnswer не загружен");
          // Попробуем еще раз через 100ms
          setTimeout(performValidation, 100);
          return;
        }

        const correctHash = window.getAnswerHash
          ? window.getAnswerHash(question.id)
          : window.encryptedAnswers[`task${question.id}`];

        console.log("Validating:", {
          userAnswer,
          correctHash,
          questionType: question.type,
        });

        const isCorrect = window.validateAnswer(
          userAnswer,
          correctHash,
          question.type
        );

        console.log("Validation result:", isCorrect);

        setAnswerStatus(isCorrect ? "correct" : "incorrect");

        // Вызываем callback сразу, логика перехода теперь в QuizContainer
        onAnswerSubmit(question.id, userAnswer, isCorrect);
      } catch (error) {
        console.error("Ошибка валидации:", error);
        setAnswerStatus("error");
      }
    };

    performValidation();
  };

  const getStatusMessage = () => {
    switch (answerStatus) {
      case "correct":
        return <div className="status-message success">✓ Правильно!</div>;
      case "incorrect":
        return (
          <div className="status-message error">
            ✗ Неправильно, попробуйте еще раз
          </div>
        );
      case "empty":
        return (
          <div className="status-message warning">
            Пожалуйста, введите ответ
          </div>
        );
      case "error":
        return (
          <div className="status-message error">
            Произошла ошибка при проверке ответа
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="question-component">
      <div className="question-content">
        <div className="question-header">
          <h2>Вопрос {question.id}</h2>
        </div>

        <div className="question-main">
          <p className="question-text">{question.question}</p>

          {getStatusMessage()}
        </div>

        <div className="question-actions">
          <form onSubmit={handleSubmit} className="answer-form">
            <div className="input-group">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Введите ваш ответ..."
                className={`answer-input ${
                  answerStatus === "correct"
                    ? "correct"
                    : answerStatus === "incorrect"
                    ? "incorrect"
                    : ""
                }`}
                disabled={answerStatus === "correct"}
              />
              <button
                type="submit"
                className={`submit-button ${
                  answerStatus === "correct"
                    ? "success"
                    : answerStatus === "incorrect"
                    ? "error"
                    : ""
                }`}
                disabled={answerStatus === "correct"}
              >
                {answerStatus === "correct" ? "Правильно!" : "Отправить"}
              </button>
            </div>
          </form>

          <div className="hint-section">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="hint-toggle"
            >
              {showHint ? "Скрыть подсказку" : "Показать подсказку"}
            </button>

            {showHint && (
              <div className="hint-content">
                <p>
                  <strong>Подсказка:</strong> {question.hint}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

window.QuestionComponent = QuestionComponent;
