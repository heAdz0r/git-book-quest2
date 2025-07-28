function App() {
  return React.createElement(
    "div",
    { className: "app" },
    React.createElement(
      "header",
      { className: "app-header" },
      React.createElement(
        "div",
        { className: "header-content" },
        React.createElement("div", {
          className: "flant-logo",
          dangerouslySetInnerHTML: {
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="22" viewBox="0 0 257 31" fill="none">
              <g fill="currentColor" clip-path="url(#a)">
                <path d="M49.845 15.462C49.845 7.214 43.131.5 34.883.5h-6.706v6.516h6.706c4.654 0 8.439 3.784 8.439 8.446S39.537 23.9 34.883 23.9h-6.706v6.516h6.706c8.248 0 14.962-6.714 14.962-14.962v.008ZM21.66 7.016V.5h-6.706C6.714.5 0 7.214 0 15.462s6.714 14.962 14.962 14.962h6.706v-6.516h-6.706c-4.654 0-8.439-3.784-8.439-8.446s3.785-8.439 8.439-8.439h6.706l-.007-.007ZM142.5.5v29.924h-6.47V6.512h-12.246l-1.381 12.963c-.801 7.431-4.196 11.025-10.483 11.025h-1.663v-6.325h1.694c2.342 0 3.624-1.412 3.967-4.395L118.138.5h24.37-.008ZM219.186.5v29.924h-6.47V18.048h-15.725v12.376h-6.47V.5h6.47v11.528h15.725V.5h6.47ZM256.274 6.512h-12.04v23.912h-6.47V6.512h-12.039V.5h30.557v6.012h-.008ZM171.981.5h-11.116l-11.727 29.924h6.866l2.053-5.67h16.724l2.053 5.67h6.866L171.981.5Zm-11.902 18.609 4.6-12.597h3.487l4.601 12.597h-12.688ZM95.02.5H75.038C68.156.5 62.57 6.085 62.57 12.975s5.585 12.474 12.474 12.474h6.753v4.975h6.47v-4.975h6.752c6.89 0 12.475-5.585 12.475-12.474C107.495 6.085 101.91.5 95.02.5ZM69.04 12.975a6.457 6.457 0 0 1 6.456-6.455h6.454v12.917h-6.454a6.457 6.457 0 0 1-6.455-6.455v-.007Zm25.522 6.454h-6.455V6.512h6.455a6.457 6.457 0 0 1 6.455 6.455 6.457 6.457 0 0 1-6.455 6.455v.007Z"/>
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 .5h256.274v30H0z"/>
                </clipPath>
              </defs>
            </svg>`,
          },
        }),
        React.createElement("h1", null, "Git для коммерческого департамента"),
        React.createElement(
          "p",
          { className: "header-description" }, // Добавлен класс для стилизации описания
          "Практические примеры использования Git в работе коммерческого департамента"
        ),
        React.createElement(
          // Добавлены декоративные элементы для более интересного дизайна
          "div",
          { className: "header-decorations" },
          React.createElement("div", { className: "decoration-orb orb-1" }),
          React.createElement("div", { className: "decoration-orb orb-2" }),
          React.createElement("div", { className: "decoration-orb orb-3" })
        )
      )
    ),
    React.createElement(
      "main",
      { className: "app-main" },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(window.QuizContainer)
      )
    ),
    React.createElement(
      "footer",
      { className: "app-footer" },
      React.createElement(
        "div",
        { className: "footer-content" },
        React.createElement(
          "div",
          { className: "footer-buttons" },
          React.createElement(
            "button",
            {
              className: "footer-button restart-test",
              onClick: () => window.location.reload(), // Перезагрузка страницы для сброса теста
              title: "Начать тест заново",
            },
            "🔄 К началу теста"
          ),
          React.createElement(
            "button",
            {
              className: "footer-button reset-data",
              onClick: () => {
                localStorage.clear(); // Очистка сохраненных данных
                window.location.reload();
              },
              title: "Сбросить все данные теста",
            },
            "🗑️ Сбросить данные"
          )
        ),
        React.createElement(
          "p",
          { className: "footer-text" },
          "2025 Флант - Практические примеры Git для коммерческого департамента"
        )
      )
    )
  );
}

// Инициализация приложения
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
