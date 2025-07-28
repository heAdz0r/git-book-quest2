// Victory Page Component - Современный дизайн
function VictoryPage({ score, totalQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  // Красивая иконка вместо ASCII
  const getVictoryIcon = () => {
    if (percentage === 100) {
      return "🏆"; // Кубок для идеального результата
    } else if (percentage >= 80) {
      return "🌟"; // Звезда для отличного результата
    } else if (percentage >= 60) {
      return "👍"; // Лайк для хорошего результата  
    } else {
      return "📚"; // Книга для результата с пространством для роста
    }
  };

  // Получаем список достижений в зависимости от результата
  const getAchievements = () => {
    const achievements = [];
    
    if (score >= 1) achievements.push("⭐ Основы Git изучены");
    if (score >= Math.ceil(totalQuestions * 0.3)) achievements.push("🌿 Работа с ветками понята");
    if (score >= Math.ceil(totalQuestions * 0.5)) achievements.push("🔀 Слияния освоены");
    if (score >= Math.ceil(totalQuestions * 0.7)) achievements.push("🏷️ Теги изучены");
    if (score >= Math.ceil(totalQuestions * 0.9)) achievements.push("🚀 Продвинутые команды");
    if (percentage === 100) achievements.push("💎 Git Master статус!");
    
    return achievements;
  };

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
  const achievements = getAchievements();

  return React.createElement(
    "div",
    { className: "victory-page-modern" },

    // Большая иконка результата
    React.createElement(
      "div", 
      { className: "victory-icon-container" },
      React.createElement(
        "div",
        { className: "victory-icon" },
        getVictoryIcon()
      )
    ),

    // Header
    React.createElement(
      "div",
      { className: "victory-header-modern" },
      React.createElement(
        "h1",
        { className: "victory-title-modern" },
        isGitMaster ? "Git Master!" : "Тест завершен!"
      ),
      React.createElement(
        "p",
        { className: "victory-subtitle-modern" },
        isGitMaster ? "🏆 Flant Edition" : gradeMessage.title
      )
    ),

    // Circular progress indicator
    React.createElement(
      "div",
      { className: "victory-progress" },
      React.createElement(
        "div",
        { className: "progress-circle" },
        React.createElement(
          "svg",
          { className: "progress-svg", viewBox: "0 0 120 120" },
          React.createElement("circle", {
            className: "progress-bg",
            cx: "60",
            cy: "60", 
            r: "54",
            fill: "none",
            stroke: "#e5e7eb",
            strokeWidth: "8"
          }),
          React.createElement("circle", {
            className: "progress-bar",
            cx: "60",
            cy: "60",
            r: "54", 
            fill: "none",
            stroke: percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444",
            strokeWidth: "8",
            strokeDasharray: 339.292, // 2 * PI * 54
            strokeDashoffset: 339.292 * (1 - percentage / 100),
            transform: "rotate(-90 60 60)"
          })
        ),
        React.createElement(
          "div",
          { className: "progress-text" },
          React.createElement("span", { className: "progress-number" }, percentage),
          React.createElement("span", { className: "progress-percent" }, "%")
        )
      ),
      React.createElement(
        "div",
        { className: "progress-stats" },
        React.createElement("div", { className: "stat-item" }, 
          React.createElement("span", { className: "stat-number" }, score),
          React.createElement("span", { className: "stat-label" }, "из " + totalQuestions)
        )
      )
    ),

    // Achievements
    achievements.length > 0 && React.createElement(
      "div",
      { className: "victory-achievements" },
      React.createElement("h3", { className: "achievements-title" }, "🎖️ Достижения"),
      React.createElement(
        "div",
        { className: "achievements-list" },
        ...achievements.map((achievement, index) =>
          React.createElement(
            "div",
            { key: index, className: "achievement-item" },
            achievement
          )
        )
      )
    ),

    // Message
    React.createElement(
      "div",
      { className: "victory-message-modern" },
      React.createElement("p", { className: "message-text" }, gradeMessage.message)
    ),

    // Actions
    React.createElement(
      "div",
      { className: "victory-actions-modern" },
      React.createElement(
        "button",
        {
          className: "victory-button-modern primary",
          onClick: onRestart,
        },
        React.createElement("span", { className: "button-icon" }, "🔄"),
        "Пройти еще раз"
      ),
      isGitMaster && React.createElement(
        "a",
        {
          href: "https://flant.ru/services/consulting",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "victory-button-modern secondary",
        },
        React.createElement("span", { className: "button-icon" }, "🚀"),
        "Консалтинг Флант" 
      ),
      React.createElement(
        "a",
        {
          href: "https://github.com/heAdz0r", // Исправлена ссылка на пользователя heAdz0r
          target: "_blank", 
          rel: "noopener noreferrer",
          className: "victory-button-modern secondary",
        },
        React.createElement("span", { className: "button-icon" }, "💻"),
        "GitHub"
      )
    )
  );
}

// Экспорт компонента в глобальную область видимости
window.VictoryPage = VictoryPage;