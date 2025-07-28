const ResultsDisplay = ({ answers, questions, score, onRestart }) => {
  const totalQuestions = questions.length;
  const successRate = Math.round((score / totalQuestions) * 100);

  // ВРЕМЕННО: Всегда показываем VictoryPage для тестирования
  // Потом вернуть: if (successRate >= 80)
  if (true) {
    return React.createElement(window.VictoryPage, {
      score: score,
      totalQuestions: totalQuestions,
      onRestart: onRestart,
    });
  }

  const getScoreMessage = () => {
    if (successRate >= 70) {
      return "Хорошо! У вас есть базовые знания Git.";
    } else if (successRate >= 50) {
      return "Неплохо, но есть куда расти.";
    } else {
      return "Рекомендуем повторить материал по Git.";
    }
  };

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Результаты проверки знаний</h2>
        <div className="score-summary">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{totalQuestions}</span>
          </div>
          <div className="score-percentage">{successRate}%</div>
        </div>
        <p className="score-message">{getScoreMessage()}</p>
      </div>

      <div className="results-details">
        <h3>Детальные результаты:</h3>
        <div className="results-list">
          {questions.map((question, index) => {
            const answer = answers[question.id];
            return (
              <div
                key={question.id}
                className={`result-item ${
                  answer?.isCorrect ? "correct" : "incorrect"
                }`}
              >
                <div className="result-header">
                  <span className="question-number">Вопрос {question.id}</span>
                  <span
                    className={`result-status ${
                      answer?.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    {answer?.isCorrect ? "Правильно" : "Неправильно"}
                  </span>
                </div>
                <div className="result-question">{question.question}</div>
                <div className="result-answer">
                  <strong>Ваш ответ:</strong>{" "}
                  {answer?.userAnswer || "Не отвечено"}
                </div>
                {answer?.attempts > 1 && (
                  <div className="result-attempts">
                    Попыток: {answer.attempts}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="results-actions">
        <button onClick={onRestart} className="restart-button">
          Пройти проверку заново
        </button>
        <div className="results-tips">
          <h4>Рекомендации для изучения:</h4>
          <ul>
            <li>
              Изучите документацию Git: <code>git help &lt;command&gt;</code>
            </li>
            <li>
              Практикуйтесь с созданным репозиторием flant-commercial-tutorial
            </li>
            <li>
              Используйте <code>git log --oneline --graph</code> для
              визуализации истории
            </li>
            <li>
              Экспериментируйте с ветками и слияниями в тестовом репозитории
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

window.ResultsDisplay = ResultsDisplay;
