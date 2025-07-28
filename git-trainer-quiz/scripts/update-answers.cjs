#!/usr/bin/env node

const { execSync } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Path to the Git repository
const REPO_PATH = "../../flant-commercial-tutorial";
const ANSWERS_FILE = "../src/data/encryptedAnswers.js";

console.log("🔄 Обновление ответов из Git репозитория...");

// Function to execute git commands
function gitCommand(command, cwd = REPO_PATH) {
  try {
    const fullPath = path.resolve(__dirname, cwd);
    console.log(`Выполнение: ${command} в ${fullPath}`);
    return execSync(command, {
      cwd: fullPath,
      encoding: "utf8",
      shell: true,
    }).trim();
  } catch (error) {
    console.error(`Ошибка выполнения команды: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to normalize answer and create hash
function createAnswerHash(answer) {
  const normalized = answer.toLowerCase().trim().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

// Function to create hash for both full and short Git hashes
function createGitHashAnswers(fullHash) {
  const shortHash = fullHash.substring(0, 7);
  return {
    full: createAnswerHash(fullHash),
    short: createAnswerHash(shortHash),
  };
}

// Get answers from Git repository
console.log("📋 Получение данных из Git репозитория...");

// Task 1: First commit hash
const firstCommitHash = gitCommand("git rev-list --max-parents=0 HEAD");
console.log(`✓ Первый коммит: ${firstCommitHash}`);

// Task 2: Keyword from technical solution (now FLANT_BEST)
const task2Answer = "FLANT_BEST";
console.log(`✓ Кодовое слово: ${task2Answer}`);

// Task 3: Review branch name
const reviewBranch = "review/tech-lead";
console.log(`✓ Ветка для ревью: ${reviewBranch}`);

// Task 4: File in .gitignore
const gitignoreContent = gitCommand("cat .gitignore");
const gitignoreFile = gitignoreContent.split("\n")[0]; // First file
console.log(`✓ Файл в .gitignore: ${gitignoreFile}`);

// Task 5: Original VAT rate (support both "18%" and "18")
const task5AnswerPercent = "18%";
const task5AnswerNumber = "18";
console.log(
  `✓ Изначальная ставка НДС: ${task5AnswerPercent} или ${task5AnswerNumber}`
);

// Task 6: Command to see last commit changes (support both variants)
const task6Answer1 = "git show HEAD";
const task6Answer2 = "git diff HEAD~1 HEAD";
console.log(
  `✓ Команда для просмотра изменений: ${task6Answer1} или ${task6Answer2}`
);

// Task 7: ACME commit hash
gitCommand("git checkout feature/special-offer-acme");
const acmeCommitHashFull = gitCommand('git log -1 --format="%H"');
const acmeCommitHashShort = gitCommand('git log -1 --format="%h"');
gitCommand("git checkout main");
console.log(`✓ Коммит ACME: ${acmeCommitHashFull} (${acmeCommitHashShort})`);

// Task 8: Final version tag
const finalTag = gitCommand("git tag");
console.log(`✓ Финальный тег: ${finalTag}`);

// Task 9: Number of commits in main
const commitCount = gitCommand("git rev-list --count main");
console.log(`✓ Количество коммитов: ${commitCount}`);

// Create encrypted answers
console.log("\n🔐 Создание зашифрованных ответов...");

const encryptedAnswers = {
  // Task 1: First commit hash (support both full and short)
  task1_full: createAnswerHash(firstCommitHash),
  task1_short: createAnswerHash(firstCommitHash.substring(0, 7)),

  // Task 2: Keyword
  task2: createAnswerHash(task2Answer),

  // Task 3: Review branch
  task3: createAnswerHash(reviewBranch),

  // Task 4: .gitignore file
  task4: createAnswerHash(gitignoreFile),

  // Task 5: VAT rate (support both "18%" and "18")
  task5_percent: createAnswerHash(task5AnswerPercent),
  task5_number: createAnswerHash(task5AnswerNumber),

  // Task 6: Git command (support both variants)
  task6_show: createAnswerHash(task6Answer1),
  task6_diff: createAnswerHash(task6Answer2),

  // Task 7: ACME commit hash (support both full and short)
  task7_full: createAnswerHash(acmeCommitHashFull),
  task7_short: createAnswerHash(acmeCommitHashShort),

  // Task 8: Final tag
  task8: createAnswerHash(finalTag),

  // Task 9: Commit count
  task9: createAnswerHash(commitCount),
};

// Generate the new encryptedAnswers.js file content
const fileContent = `// Зашифрованные хеши правильных ответов
// Автоматически сгенерировано скриптом update-answers.js
// Последнее обновление: ${new Date().toISOString()}

window.encryptedAnswers = {
  // task1: хеш первого коммита (${firstCommitHash})
  task1_full: "${encryptedAnswers.task1_full}",
  task1_short: "${encryptedAnswers.task1_short}",

  // task2: кодовое слово "${task2Answer}"
  task2: "${encryptedAnswers.task2}",

  // task3: ветка для ревью "${reviewBranch}"
  task3: "${encryptedAnswers.task3}",

  // task4: файл в .gitignore "${gitignoreFile}"
  task4: "${encryptedAnswers.task4}",

  // task5: изначальная ставка НДС "${task5AnswerPercent}" или "${task5AnswerNumber}"
  task5_percent: "${encryptedAnswers.task5_percent}",
  task5_number: "${encryptedAnswers.task5_number}",

  // task6: команда для просмотра изменений "${task6Answer1}" или "${task6Answer2}"
  task6_show: "${encryptedAnswers.task6_show}",
  task6_diff: "${encryptedAnswers.task6_diff}",

  // task7: коммит ACME (${acmeCommitHashFull} / ${acmeCommitHashShort})
  task7_full: "${encryptedAnswers.task7_full}",
  task7_short: "${encryptedAnswers.task7_short}",

  // task8: финальный тег "${finalTag}"
  task8: "${encryptedAnswers.task8}",

  // task9: количество коммитов "${commitCount}"
  task9: "${encryptedAnswers.task9}"
};

// Функция для нормализации ответов (такая же как в answerValidator.js)
const normalizeInput = (input) => {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .toLowerCase() // Приведение к нижнему регистру
    .trim() // Удаление пробелов в начале и конце
    .replace(/\\s+/g, " "); // Замена множественных пробелов на одинарные
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
      full: window.encryptedAnswers[\`task\${taskId}_full\`],
      short: window.encryptedAnswers[\`task\${taskId}_short\`]
    };
  }
  // Поддержка процентов и чисел для задачи 5
  if (taskId === 5) {
    return {
      percent: window.encryptedAnswers[\`task\${taskId}_percent\`],
      number: window.encryptedAnswers[\`task\${taskId}_number\`]
    };
  }
  // Поддержка двух команд для задачи 6
  if (taskId === 6) {
    return {
      show: window.encryptedAnswers[\`task\${taskId}_show\`],
      diff: window.encryptedAnswers[\`task\${taskId}_diff\`]
    };
  }
  return window.encryptedAnswers[\`task\${taskId}\`];
};
`;

// Write the updated file
const answersFilePath = path.resolve(__dirname, ANSWERS_FILE);
fs.writeFileSync(answersFilePath, fileContent, "utf8");

console.log("\n✅ Файл encryptedAnswers.js успешно обновлен!");
console.log(`📁 Путь: ${answersFilePath}`);

// Display summary
console.log("\n📊 Сводка ответов:");
console.log(
  `1. Первый коммит: ${firstCommitHash} (${firstCommitHash.substring(0, 7)})`
);
console.log(`2. Кодовое слово: ${task2Answer}`);
console.log(`3. Ветка ревью: ${reviewBranch}`);
console.log(`4. Файл .gitignore: ${gitignoreFile}`);
console.log(`5. Ставка НДС: ${task5AnswerPercent} или ${task5AnswerNumber}`);
console.log(`6. Git команда: ${task6Answer1} или ${task6Answer2}`);
console.log(`7. ACME коммит: ${acmeCommitHashFull} (${acmeCommitHashShort})`);
console.log(`8. Финальный тег: ${finalTag}`);
console.log(`9. Количество коммитов: ${commitCount}`);
