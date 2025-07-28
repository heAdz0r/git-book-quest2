/**
 * Нормализует пользовательский ввод перед хешированием
 * @param {string} input - Пользовательский ввод
 * @returns {string} - Нормализованная строка
 */
window.normalizeInput = (input) => {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase() // Приведение к нижнему регистру
    .trim() // Удаление пробелов в начале и конце
    .replace(/\s+/g, " "); // Замена множественных пробелов на одинарные
};

/**
 * Валидирует ответ пользователя против правильного хеша
 * @param {string} userAnswer - Ответ пользователя
 * @param {string|object} correctHash - SHA-256 хеш правильного ответа или объект с full/short хешами
 * @param {string} type - Тип ответа (hash, text, command, number)
 * @returns {boolean} - true если ответ правильный, false если нет
 */
window.validateAnswer = (userAnswer, correctHash, type = "text") => {
  try {
    // Нормализация пользовательского ввода по типу
    const normalizedAnswer = window.normalizeByType(userAnswer, type);

    // Проверка на пустой ответ
    if (!normalizedAnswer) {
      return false;
    }

    // Создание SHA-256 хеша от нормализованного ответа
    const userHash = CryptoJS.SHA256(normalizedAnswer).toString();

    // Если correctHash - объект с full/short хешами (для Git хешей)
    if (
      typeof correctHash === "object" &&
      correctHash.full &&
      correctHash.short
    ) {
      return (
        secureCompare(userHash, correctHash.full) ||
        secureCompare(userHash, correctHash.short)
      );
    }

    // Если correctHash - объект с percent/number хешами (для задачи 5)
    if (
      typeof correctHash === "object" &&
      correctHash.percent &&
      correctHash.number
    ) {
      return (
        secureCompare(userHash, correctHash.percent) ||
        secureCompare(userHash, correctHash.number)
      );
    }

    // Если correctHash - объект с show/diff хешами (для задачи 6)
    if (
      typeof correctHash === "object" &&
      correctHash.show &&
      correctHash.diff
    ) {
      return (
        secureCompare(userHash, correctHash.show) ||
        secureCompare(userHash, correctHash.diff)
      );
    }

    // Обычное сравнение для строковых хешей
    return secureCompare(userHash, correctHash);
  } catch (error) {
    console.error("Ошибка при валидации ответа:", error);
    return false;
  }
};

/**
 * Безопасное сравнение строк для предотвращения timing attacks
 * @param {string} a - Первая строка
 * @param {string} b - Вторая строка
 * @returns {boolean} - true если строки равны
 */
const secureCompare = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

/**
 * Создает SHA-256 хеш от строки (для тестирования и отладки)
 * @param {string} input - Входная строка
 * @param {string} type - Тип ответа (hash, text, command, number)
 * @returns {string} - SHA-256 хеш
 */
window.createHash = (input, type = "text") => {
  const normalized = window.normalizeByType(input, type);
  return CryptoJS.SHA256(normalized).toString();
};

/**
 * Проверяет тип ответа и применяет соответствующую нормализацию
 * @param {string} answer - Ответ пользователя
 * @param {string} type - Тип ответа (hash, text, command, number)
 * @returns {string} - Нормализованный ответ
 */
window.normalizeByType = (answer, type) => {
  const baseNormalized = window.normalizeInput(answer);

  switch (type) {
    case "hash":
      // Для хешей убираем все пробелы и приводим к нижнему регистру
      return baseNormalized.replace(/\s/g, "");

    case "command":
      // Для команд нормализуем пробелы, но сохраняем структуру
      return baseNormalized.replace(/\s+/g, " ");

    case "number":
      // Для чисел убираем все нечисловые символы
      return baseNormalized.replace(/[^\d]/g, "");

    case "text":
    default:
      // Для текста используем базовую нормализацию
      return baseNormalized;
  }
};

/**
 * Проверяет, является ли строка валидным SHA-256 хешем
 * @param {string} hash - Строка для проверки
 * @returns {boolean} - true если строка является валидным хешем
 */
window.isValidHash = (hash) => {
  if (typeof hash !== "string") {
    return false;
  }

  // SHA-256 хеш должен быть 64 символа в длину и содержать только hex символы
  return /^[a-f0-9]{64}$/i.test(hash);
};

/**
 * Валидирует множественные ответы одновременно
 * @param {Array} answers - Массив объектов {userAnswer, correctHash, type}
 * @returns {Array} - Массив результатов валидации
 */
window.validateMultipleAnswers = (answers) => {
  return answers.map((answer, index) => {
    try {
      const { userAnswer, correctHash, type = "text" } = answer;

      if (!window.isValidHash(correctHash)) {
        console.warn(`Неправильный хеш для ответа ${index + 1}:`, correctHash);
        return false;
      }

      return window.validateAnswer(userAnswer, correctHash, type);
    } catch (error) {
      console.error(`Ошибка валидации ответа ${index + 1}:`, error);
      return false;
    }
  });
};
