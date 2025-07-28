// Зашифрованные хеши правильных ответов
// Автоматически сгенерировано скриптом update-answers.js
// Последнее обновление: 2025-07-28T08:21:10.750Z

window.encryptedAnswers = {
  // task1: хеш первого коммита (0b2545d842e6b2504d3eef6ac2f152eac4eaaea5)
  task1_full: "bbd549f1dec81e3674a740587fe78f3ba4056e6ce85395c04b6fbbe5bfe81cd3",
  task1_short: "6cc4e550db497430bbb2c0bf6fa84690d7974b86e14c9d05ccb42465dabebc0c",

  // task2: кодовое слово "FLANT_BEST"
  task2: "25b33d33a3e14f26de8167e5c3c6e3f65357133c607da3828c0b29593f03f961",

  // task3: ветка для ревью "review/tech-lead"
  task3: "b75439865647736f42d0eec7e5dafc68b60e350b124bfcea0db642534f0e7b8a",

  // task4: файл в .gitignore "notes.txt"
  task4: "e39538e7f27a7bf579cd9b85a103c0f0b86b60b788534295538d0301a9c5dce6",

  // task5: изначальная ставка НДС "18%" или "18"
  task5_percent: "e70b96ebb11535361c667c2548a9285314f0a1b2cffb213acf55ba792254e734",
  task5_number: "4ec9599fc203d176a301536c2e091a19bc852759b255bd6818810a42c5fed14a",

  // task6: команда для просмотра изменений "git show HEAD" или "git diff HEAD~1 HEAD"
  task6_show: "f3e2c9ad7a2b26d701c9cc28b112fb928a6435c26dc438bdf8be9b29de584bdc",
  task6_diff: "871e28d6a6c9158ff1d9136e75a8b77241f0a165cc8107a0fb4b0c195c4da3bf",

  // task7: коммит ACME (60c9c91e4dcddc3b65074a47b4cf444a46c45a5f / 60c9c91)
  task7_full: "f231d0c7723aa9cef4260029e9785044192c6177a920a03b3715b0dfc0d9efd3",
  task7_short: "014ba157af46ec1327765ef3354738d4d7a145e80eb4db571d997459ceb90c08",

  // task8: финальный тег "v1.0-sent"
  task8: "e55bb22c12cdebbcb84aedb7fe24281782ce2cf887fb115a28aa593b02af6ea4",

  // task9: количество коммитов "9"
  task9: "19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7"
};

// Функция для нормализации ответов (такая же как в answerValidator.js)
const normalizeInput = (input) => {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase() // Приведение к нижнему регистру
    .trim() // Удаление пробелов в начале и конце
    .replace(/\s+/g, " "); // Замена множественных пробелов на одинарные
};

// Функция для генерации хеша из ответа
window.generateAnswerHash = (answer) => {
  const normalized = normalizeInput(answer);
  return CryptoJS.SHA256(normalized).toString();
};

// Функция для получения хеша ответа по ID задачи
window.getAnswerHash = (taskId) => {
  // Поддержка как полных, так и сокращенных хешей для задач 1 и 7
  if (taskId === 1 || taskId === 7) {
    return {
      full: window.encryptedAnswers[`task${taskId}_full`],
      short: window.encryptedAnswers[`task${taskId}_short`]
    };
  }
  // Поддержка процентов и чисел для задачи 5
  if (taskId === 5) {
    return {
      percent: window.encryptedAnswers[`task${taskId}_percent`],
      number: window.encryptedAnswers[`task${taskId}_number`]
    };
  }
  // Поддержка двух команд для задачи 6
  if (taskId === 6) {
    return {
      show: window.encryptedAnswers[`task${taskId}_show`],
      diff: window.encryptedAnswers[`task${taskId}_diff`]
    };
  }
  return window.encryptedAnswers[`task${taskId}`];
};
