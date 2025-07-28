const ProgressIndicator = ({
  current,
  total,
  answeredQuestions = new Set(),
  onQuestionClick,
}) => {
  const progressPercentage = (current / total) * 100;

  return React.createElement(
    "div",
    { className: "progress-indicator" },
    React.createElement(
      "div",
      { className: "progress-header" },
      React.createElement(
        "span",
        { className: "progress-text" },
        `Вопрос ${current} из ${total}`
      ),
      React.createElement(
        "span",
        { className: "progress-percentage" },
        `${Math.round(progressPercentage)}%`
      )
    ),
    React.createElement(
      "div",
      { className: "progress-bar" },
      React.createElement("div", {
        className: "progress-fill",
        style: { width: `${progressPercentage}%` },
      })
    ),
    React.createElement(
      "div",
      { className: "progress-dots" },
      Array.from({ length: total }, (_, index) => {
        const questionId = index + 1;
        const isAnswered = answeredQuestions.has(questionId);
        const isCurrent = index === current - 1;

        let className = "progress-dot ";
        if (isAnswered) {
          className += "completed";
        } else if (isCurrent) {
          className += "current";
        } else {
          className += "pending";
        }

        return React.createElement("div", {
          key: index,
          className: className,
          onClick: () => onQuestionClick && onQuestionClick(index),
          title: `Вопрос ${questionId}${isAnswered ? " (отвечен)" : ""}`,
          style: { cursor: onQuestionClick ? "pointer" : "default" },
        });
      })
    )
  );
};

window.ProgressIndicator = ProgressIndicator;
