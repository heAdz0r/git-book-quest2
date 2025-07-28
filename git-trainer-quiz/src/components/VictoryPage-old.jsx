// Victory Page Component - Git Master (Flant Edition)
function VictoryPage({ score, totalQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  // ASCII Art для Git Master
  const asciiArt = `
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║    ██████╗ ██╗████████╗    ███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗  ║
    ║   ██╔════╝ ██║╚══██╔══╝    ████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗ ║
    ║   ██║  ███╗██║   ██║       ██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝ ║
    ║   ██║   ██║██║   ██║       ██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗ ║
    ║   ╚██████╔╝██║   ██║       ██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║ ║
    ║    ╚═════╝ ╚═╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ║
    ║                                                               ║
    ║                        🏆 FLANT EDITION 🏆                    ║
    ║                                                               ║
    ║    ┌─────────────────────────────────────────────────────┐    ║
    ║    │  "Теперь ты знаешь Git как настоящий профессионал!" │    ║
    ║    │                                                     │    ║
    ║    │     ⭐ Коммиты освоены                              │    ║
    ║    │     🌿 Ветки покорены                               │    ║
    ║    │     🔀 Слияния изучены                              │    ║
    ║    │     🏷️  Теги поняты                                 │    ║
    ║    │                                                     │    ║
    ║    │        Добро пожаловать в мир Git-мастеров!        │    ║
    ║    └─────────────────────────────────────────────────────┘    ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
  `;

  const getGradeMessage = () => {
    if (percentage === 100) {
      return {
        title: "Идеальный результат! 🎯",
        message:
          "Поздравляем! Вы продемонстрировали безупречное знание Git. Теперь вы настоящий Git Master и можете с уверенностью работать с любыми Git-репозиториями в коммерческих проектах.",
      };
    } else if (percentage >= 80) {
      return {
        title: "Отличная работа! 🌟",
        message:
          "Вы показали отличные знания Git! Небольшие пробелы легко восполнить практикой. Продолжайте изучать Git - вы на правильном пути к мастерству.",
      };
    } else if (percentage >= 60) {
      return {
        title: "Хороший результат! 👍",
        message:
          "У вас есть базовые знания Git, но есть куда расти. Рекомендуем повторить материал и попробовать еще раз. Практика - ключ к успеху!",
      };
    } else {
      return {
        title: "Есть над чем поработать 📚",
        message:
          "Git - сложная тема, и это нормально, что не все получилось с первого раза. Изучите материалы еще раз и попробуйте снова. Каждый эксперт когда-то был новичком!",
      };
    }
  };

  const gradeMessage = getGradeMessage();
  const isGitMaster = percentage === 100;

  return React.createElement(
    "div",
    { className: "victory-page" },

    // Header
    React.createElement(
      "div",
      { className: "victory-header" },
      React.createElement(
        "h1",
        { className: "victory-title" },
        isGitMaster ? "🏆 Git Master 🏆" : "Тест завершен!"
      ),
      React.createElement(
        "p",
        { className: "victory-subtitle" },
        isGitMaster ? "Flant Edition" : "Результаты вашего тестирования"
      )
    ),

    // ASCII Art (только для Git Master)
    isGitMaster &&
      React.createElement("div", { className: "ascii-art" }, asciiArt),

    // Statistics
    React.createElement(
      "div",
      { className: "victory-stats" },
      React.createElement(
        "div",
        { className: "victory-stat" },
        React.createElement("div", { className: "victory-stat-value" }, score),
        React.createElement(
          "div",
          { className: "victory-stat-label" },
          "Правильных ответов"
        )
      ),
      React.createElement(
        "div",
        { className: "victory-stat" },
        React.createElement(
          "div",
          { className: "victory-stat-value" },
          totalQuestions
        ),
        React.createElement(
          "div",
          { className: "victory-stat-label" },
          "Всего вопросов"
        )
      ),
      React.createElement(
        "div",
        { className: "victory-stat" },
        React.createElement(
          "div",
          { className: "victory-stat-value" },
          percentage + "%"
        ),
        React.createElement(
          "div",
          { className: "victory-stat-label" },
          "Процент успеха"
        )
      ),
      React.createElement(
        "div",
        { className: "victory-stat" },
        React.createElement(
          "div",
          { className: "victory-stat-value" },
          isGitMaster
            ? "A+"
            : percentage >= 80
            ? "A"
            : percentage >= 60
            ? "B"
            : "C"
        ),
        React.createElement(
          "div",
          { className: "victory-stat-label" },
          "Оценка"
        )
      )
    ),

    // Message
    React.createElement(
      "div",
      { className: "victory-message" },
      React.createElement("h3", null, gradeMessage.title),
      React.createElement("p", null, gradeMessage.message)
    ),

    // Actions
    React.createElement(
      "div",
      { className: "victory-actions" },
      React.createElement(
        "button",
        {
          className: "victory-button",
          onClick: onRestart,
        },
        React.createElement("span", null, "🔄"),
        "Пройти еще раз"
      ),
      isGitMaster &&
        React.createElement(
          "a",
          {
            href: "https://flant.ru/services/consulting",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "victory-button secondary",
          },
          React.createElement("span", null, "🚀"),
          "Узнать о консалтинге Флант"
        ),
      React.createElement(
        "a",
        {
          href: "https://github.com/flant",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "victory-button secondary",
        },
        React.createElement("span", null, "💻"),
        "GitHub Флант"
      )
    )
  );
}

// Экспорт компонента в глобальную область видимости
window.VictoryPage = VictoryPage;
