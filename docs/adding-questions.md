# Добавление новых вопросов в викторину

Это руководство описывает процесс добавления новых вопросов в интерактивную викторину Git-тренажера.

## 📋 Обзор процесса

Добавление нового вопроса включает несколько этапов:

1. **Планирование вопроса** - определение цели и типа
2. **Обновление данных** - добавление в questions.js
3. **Генерация хеша ответа** - создание зашифрованного ответа
4. **Обновление скрипта** - модификация update-answers.cjs
5. **Тестирование** - проверка корректности работы

## 🎯 Типы вопросов

### 1. Hash (Хеш коммита)

Вопросы, требующие найти хеш конкретного коммита:

```javascript
{
  id: 1,
  question: "Каков хэш самого первого коммита в истории репозитория?",
  hint: "Используйте: git log --reverse или git rev-list --max-parents=0 HEAD",
  type: "hash",
}
```

**Особенности:**

- Поддерживает как полные, так и сокращенные хеши
- Автоматически нормализуется к нижнему регистру
- Удаляются лишние пробелы

### 2. Text (Текстовый ответ)

Вопросы с текстовыми ответами:

```javascript
{
  id: 2,
  question: "В разделе 'Техническое решение' было спрятано ключевое слово. Какое оно?",
  hint: "Найдите коммит с техническим решением и посмотрите его содержимое",
  type: "text",
}
```

**Особенности:**

- Регистронезависимый
- Удаляются пробелы в начале и конце
- Поддерживает специальные символы

### 3. Command (Git команда)

Вопросы о Git командах:

```javascript
{
  id: 6,
  question: "Какую команду нужно выполнить, чтобы увидеть изменения в последнем коммите?",
  hint: "Подумайте о команде для просмотра изменений между коммитами",
  type: "command",
}
```

**Особенности:**

- Поддерживает различные варианты команд
- Нормализация пробелов
- Может принимать несколько правильных вариантов

### 4. Number (Числовой ответ)

Вопросы с числовыми ответами:

```javascript
{
  id: 9,
  question: "Сколько всего коммитов в ветке main?",
  hint: "Подсчитайте коммиты в main: git rev-list --count main",
  type: "number",
}
```

**Особенности:**

- Принимает только числа
- Автоматическое удаление нечисловых символов
- Поддержка как строк, так и чисел

## 🔧 Пошаговое добавление вопроса

### Шаг 1: Планирование

Определите:

- **Цель вопроса** - какую Git-концепцию проверяем
- **Тип ответа** - hash, text, command, или number
- **Сложность** - начальный, средний, продвинутый уровень
- **Источник данных** - откуда берется правильный ответ

### Шаг 2: Добавление в questions.js

Откройте `git-trainer-quiz/src/data/questions.js` и добавьте новый вопрос:

```javascript
window.questions = [
  // ... существующие вопросы ...
  {
    id: 10, // Следующий доступный ID
    question: "Какая команда показывает статус рабочей директории?",
    hint: "Эта команда показывает измененные, добавленные и неотслеживаемые файлы",
    type: "command",
  },
];
```

### Шаг 3: Определение правильного ответа

В зависимости от типа вопроса, определите правильный ответ:

```javascript
// Для статического ответа (не зависит от Git-репозитория)
const staticAnswer = "git status";

// Для динамического ответа (извлекается из репозитория)
const dynamicAnswer = gitCommand("git rev-parse HEAD");
```

### Шаг 4: Обновление update-answers.cjs

Добавьте логику получения ответа в `git-trainer-quiz/scripts/update-answers.cjs`:

```javascript
// Для статического ответа
const task10Answer = "git status";
console.log(`✓ Команда статуса: ${task10Answer}`);

// Для динамического ответа
const task11Answer = gitCommand("git describe --tags --abbrev=0");
console.log(`✓ Последний тег: ${task11Answer}`);

// Добавьте в объект encryptedAnswers
const encryptedAnswers = {
  // ... существующие ответы ...
  task10: createAnswerHash(task10Answer),
  task11: createAnswerHash(task11Answer),
};

// Обновите генерацию файла
const fileContent = `// ... существующий контент ...

  // task10: команда статуса "${task10Answer}"
  task10: "${encryptedAnswers.task10}",

  // task11: последний тег "${task11Answer}"
  task11: "${encryptedAnswers.task11}",
`;
```

### Шаг 5: Обновление валидатора (если нужно)

Для сложных типов ответов может потребоваться обновить `git-trainer-quiz/src/utils/answerValidator.js`:

```javascript
// Пример: поддержка множественных правильных ответов
export const validateAnswer = (userAnswer, taskId) => {
  const normalizedAnswer = normalizeInput(userAnswer);
  const userHash = CryptoJS.SHA256(normalizedAnswer).toString();

  // Для команд с несколькими вариантами
  if (taskId === 10) {
    const validCommands = ["git status", "git st"]; // алиас
    return validCommands.some((cmd) => {
      const cmdHash = CryptoJS.SHA256(normalizeInput(cmd)).toString();
      return userHash === cmdHash;
    });
  }

  // Стандартная проверка
  const correctHash = window.getAnswerHash(taskId);
  return userHash === correctHash;
};
```

## 🎨 Продвинутые техники

### Множественные правильные ответы

Для вопросов с несколькими правильными вариантами:

```javascript
// В update-answers.cjs
const task12Answers = ["git log", "git log --oneline", "git log --graph"];
const task12Hashes = task12Answers.map(answer => createAnswerHash(answer));

// В encryptedAnswers.js
task12: ${JSON.stringify(task12Hashes)},

// В answerValidator.js
if (Array.isArray(correctHash)) {
  return correctHash.includes(userHash);
}
```

### Условные вопросы

Вопросы, которые появляются только при определенных условиях:

```javascript
// В questions.js
{
  id: 13,
  question: "Какой хеш у коммита слияния?",
  hint: "Найдите merge commit в истории",
  type: "hash",
  condition: () => {
    // Показывать только если есть merge коммиты
    return window.gitData && window.gitData.hasMergeCommits;
  }
}
```

### Динамические подсказки

Подсказки, которые адаптируются к контексту:

```javascript
{
  id: 14,
  question: "Сколько файлов было изменено в последнем коммите?",
  hint: () => {
    const lastCommit = window.gitData?.lastCommitHash || "HEAD";
    return `Используйте: git show --stat ${lastCommit}`;
  },
  type: "number",
}
```

## 🧪 Тестирование новых вопросов

### Локальное тестирование

```bash
# 1. Пересоздайте репозиторий
./setup_repository.sh

# 2. Запустите веб-приложение
cd git-trainer-quiz
bun run dev

# 3. Проверьте новый вопрос в браузере
```

### Автоматическое тестирование

Создайте тест для нового вопроса:

```javascript
// test/questions.test.js
import { validateAnswer } from "../src/utils/answerValidator.js";

describe("Question 10: Git Status Command", () => {
  test("accepts correct command", () => {
    const correctAnswers = ["git status", "git st"];
    correctAnswers.forEach((answer) => {
      expect(validateAnswer(answer, 10)).toBe(true);
    });
  });

  test("rejects incorrect command", () => {
    const incorrectAnswers = ["git log", "status", "git stat"];
    incorrectAnswers.forEach((answer) => {
      expect(validateAnswer(answer, 10)).toBe(false);
    });
  });
});
```

### Тестирование хешей

Проверьте корректность генерации хешей:

```bash
# Ручная проверка хеша
node -e "
const crypto = require('crypto');
const answer = 'git status';
const normalized = answer.toLowerCase().trim();
const hash = crypto.createHash('sha256').update(normalized).digest('hex');
console.log('Expected hash:', hash);
"
```

## 📊 Аналитика вопросов

### Отслеживание сложности

Добавьте метрики для анализа сложности вопросов:

```javascript
// В QuestionComponent.jsx
const [attempts, setAttempts] = useState(0);
const [timeSpent, setTimeSpent] = useState(0);

const handleSubmit = (answer) => {
  setAttempts((prev) => prev + 1);

  // Логирование для аналитики
  console.log(`Question ${question.id}: ${attempts} attempts, ${timeSpent}s`);

  if (validateAnswer(answer, question.id)) {
    // Успешный ответ
    trackSuccess(question.id, attempts, timeSpent);
  }
};
```

### Статистика ответов

Собирайте статистику для улучшения вопросов:

```javascript
// analytics.js
export const trackQuestionStats = (
  questionId,
  isCorrect,
  attempts,
  timeSpent
) => {
  const stats = JSON.parse(localStorage.getItem("questionStats") || "{}");

  if (!stats[questionId]) {
    stats[questionId] = {
      totalAttempts: 0,
      successfulAttempts: 0,
      averageTime: 0,
      difficulty: "unknown",
    };
  }

  stats[questionId].totalAttempts += attempts;
  if (isCorrect) {
    stats[questionId].successfulAttempts++;
  }

  // Расчет сложности
  const successRate =
    stats[questionId].successfulAttempts / stats[questionId].totalAttempts;
  stats[questionId].difficulty =
    successRate > 0.8 ? "easy" : successRate > 0.5 ? "medium" : "hard";

  localStorage.setItem("questionStats", JSON.stringify(stats));
};
```

## 🔍 Отладка вопросов

### Проверка хешей

Утилита для проверки правильности хешей:

```javascript
// debug/hash-checker.js
const crypto = require("crypto");

const checkHash = (answer, expectedHash) => {
  const normalized = answer.toLowerCase().trim().replace(/\s+/g, " ");
  const actualHash = crypto
    .createHash("sha256")
    .update(normalized)
    .digest("hex");

  console.log(`Answer: "${answer}"`);
  console.log(`Normalized: "${normalized}"`);
  console.log(`Expected: ${expectedHash}`);
  console.log(`Actual:   ${actualHash}`);
  console.log(`Match: ${actualHash === expectedHash}`);
};

// Использование
checkHash("git status", "expected_hash_here");
```

### Логирование валидации

Добавьте подробное логирование в валидатор:

```javascript
export const validateAnswer = (userAnswer, taskId, debug = false) => {
  const normalizedAnswer = normalizeInput(userAnswer);
  const userHash = CryptoJS.SHA256(normalizedAnswer).toString();
  const correctHash = window.getAnswerHash(taskId);

  if (debug) {
    console.log("Validation Debug:", {
      original: userAnswer,
      normalized: normalizedAnswer,
      userHash,
      correctHash,
      taskId,
    });
  }

  return userHash === correctHash;
};
```

## 📋 Чек-лист для нового вопроса

- [ ] Определена цель и тип вопроса
- [ ] Добавлен в questions.js с уникальным ID
- [ ] Написана понятная подсказка
- [ ] Обновлен update-answers.cjs
- [ ] Сгенерирован правильный хеш
- [ ] Протестирован локально
- [ ] Проверена нормализация ответа
- [ ] Добавлены тесты (если необходимо)
- [ ] Обновлена документация
- [ ] Проверена совместимость с существующими вопросами

## 🚀 Лучшие практики

### Формулировка вопросов

- **Будьте конкретными**: "Каков хеш коммита X?" вместо "Найдите хеш"
- **Используйте контекст**: Ссылайтесь на конкретные элементы сценария
- **Избегайте двусмысленности**: Один вопрос - один правильный ответ

### Написание подсказок

- **Укажите конкретную команду**: `git log --oneline` вместо "посмотрите историю"
- **Дайте контекст**: Объясните, где искать ответ
- **Предложите альтернативы**: Несколько способов решения

### Безопасность

- **Всегда хешируйте ответы**: Никогда не храните открытый текст
- **Нормализуйте ввод**: Обеспечьте консистентность
- **Проверяйте типы**: Валидируйте входные данные

---

**Совет**: Тестируйте новые вопросы с разными пользователями, чтобы убедиться в их понятности и корректности.
