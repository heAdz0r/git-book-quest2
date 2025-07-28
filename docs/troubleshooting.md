# Решение проблем (Troubleshooting)

Это руководство поможет решить наиболее частые проблемы при использовании Git-тренажера "Управляем КП".

## 🚨 Частые проблемы

### 1. Проблемы с установкой и запуском

#### Ошибка: "Git не установлен"

**Симптомы:**

```bash
[ERROR] Git не установлен
```

**Решение:**

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git

# Проверка установки
git --version
```

#### Ошибка: "Требуется Git версии 2.20 или выше"

**Симптомы:**

```bash
[ERROR] Требуется Git версии 2.20 или выше (текущая: 2.17.1)
```

**Решение:**

```bash
# Обновление Git на macOS
brew upgrade git

# Обновление Git на Ubuntu
sudo add-apt-repository ppa:git-core/ppa
sudo apt update
sudo apt install git

# Проверка версии
git --version
```

#### Ошибка: "Bun не установлен"

**Симптомы:**

```bash
[ERROR] Bun не установлен
```

**Решение:**

```bash
# Установка Bun
curl -fsSL https://bun.sh/install | bash

# Перезагрузка терминала или
source ~/.bashrc

# Проверка установки
bun --version
```

### 2. Проблемы со скриптом создания репозитория

#### Ошибка: "Permission denied"

**Симптомы:**

```bash
bash: ./setup_repository.sh: Permission denied
```

**Решение:**

```bash
# Добавление прав на выполнение
chmod +x setup_repository.sh

# Запуск
./setup_repository.sh
```

#### Ошибка: "Репозиторий уже существует"

**Симптомы:**

```bash
[WARNING] Удаление существующего репозитория flant-commercial-tutorial
```

**Решение:**
Это нормальное поведение. Скрипт автоматически удаляет старый репозиторий перед созданием нового.

Если нужно сохранить существующий репозиторий:

```bash
# Переименуйте существующий репозиторий
mv flant-commercial-tutorial flant-commercial-tutorial-backup

# Запустите скрипт
./setup_repository.sh
```

#### Ошибка при выполнении Git команд

**Симптомы:**

```bash
fatal: not a git repository (or any of the parent directories): .git
```

**Решение:**

```bash
# Убедитесь, что вы в правильной директории
pwd

# Проверьте содержимое
ls -la

# Если репозиторий поврежден, пересоздайте его
rm -rf flant-commercial-tutorial
./setup_repository.sh
```

### 3. Проблемы с веб-приложением

#### Ошибка: "Cannot find module"

**Симптомы:**

```bash
error: Cannot resolve "react" from "src/App.jsx"
```

**Решение:**

```bash
cd git-trainer-quiz

# Очистка кеша и переустановка зависимостей
rm -rf node_modules bun.lockb
bun install

# Запуск
bun run dev
```

#### Ошибка: "Port already in use"

**Симптомы:**

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Решение:**

```bash
# Найти процесс, использующий порт
lsof -i :3000

# Завершить процесс (замените PID на реальный)
kill -9 <PID>

# Или использовать другой порт
PORT=3001 bun run dev
```

#### Веб-приложение не загружается в браузере

**Симптомы:**

- Белая страница
- "This site can't be reached"

**Решение:**

1. Проверьте, что сервер запущен:

   ```bash
   cd git-trainer-quiz
   bun run dev
   ```

2. Проверьте правильность URL:

   - Обычно: `http://localhost:3000`
   - Проверьте вывод команды для точного адреса

3. Проверьте файрвол и антивирус

4. Попробуйте другой браузер

### 4. Проблемы с вопросами и ответами

#### Правильный ответ не принимается

**Симптомы:**

- Вы уверены в правильности ответа, но система его не принимает

**Диагностика:**

```bash
# Проверьте хеши в консоли браузера (F12)
console.log(window.encryptedAnswers);

# Проверьте нормализацию ответа
console.log(window.normalizeInput("ваш ответ"));

# Создайте хеш от вашего ответа
console.log(window.createHash("ваш ответ", "text"));
```

**Решение:**

1. Проверьте регистр и пробелы в ответе
2. Для Git хешей попробуйте как полный, так и сокращенный вариант
3. Для команд проверьте точность синтаксиса
4. Пересоздайте репозиторий и обновите хеши:
   ```bash
   ./setup_repository.sh
   ```

#### Хеши ответов не обновляются

**Симптомы:**

- После изменения скрипта ответы остаются старыми

**Решение:**

```bash
# Ручное обновление хешей
cd git-trainer-quiz
bun run update-answers

# Или пересоздание всего репозитория
cd ..
./setup_repository.sh
```

#### Ошибка: "window.encryptedAnswers не загружен"

**Симптомы:**

```javascript
window.encryptedAnswers не загружен
```

**Решение:**

1. Проверьте, что файл `encryptedAnswers.js` существует:

   ```bash
   ls -la git-trainer-quiz/src/data/encryptedAnswers.js
   ```

2. Проверьте содержимое файла:

   ```bash
   head git-trainer-quiz/src/data/encryptedAnswers.js
   ```

3. Обновите хеши:

   ```bash
   cd git-trainer-quiz
   bun run update-answers
   ```

4. Перезапустите веб-приложение:
   ```bash
   bun run dev
   ```

### 5. Проблемы с Git-репозиторием

#### Ошибка: "Ветка не найдена"

**Симптомы:**

```bash
error: pathspec 'review/tech-lead' did not match any file(s) known to git
```

**Решение:**

```bash
cd flant-commercial-tutorial

# Проверьте все ветки
git branch -a

# Если ветки нет, пересоздайте репозиторий
cd ..
./setup_repository.sh
```

#### Коммиты имеют неправильные хеши

**Симптомы:**

- Хеши коммитов отличаются от ожидаемых

**Причина:**
Git хеши зависят от времени создания, автора и содержимого.

**Решение:**

```bash
# Пересоздайте репозиторий
./setup_repository.sh

# Хеши обновятся автоматически
```

#### Файлы в репозитории повреждены

**Симптомы:**

```bash
error: object file .git/objects/xx/xxxxx is empty
```

**Решение:**

```bash
# Полное пересоздание репозитория
rm -rf flant-commercial-tutorial
./setup_repository.sh
```

## 🔧 Инструменты диагностики

### Проверка системы

Создайте файл `check-system.sh`:

```bash
#!/bin/bash

echo "=== Проверка системы ==="

# Проверка Git
if command -v git &> /dev/null; then
    echo "✓ Git установлен: $(git --version)"
else
    echo "✗ Git не установлен"
fi

# Проверка Bun
if command -v bun &> /dev/null; then
    echo "✓ Bun установлен: $(bun --version)"
else
    echo "✗ Bun не установлен"
fi

# Проверка Node.js (альтернатива)
if command -v node &> /dev/null; then
    echo "✓ Node.js доступен: $(node --version)"
else
    echo "- Node.js не установлен (не критично)"
fi

# Проверка репозитория
if [ -d "flant-commercial-tutorial" ]; then
    echo "✓ Репозиторий существует"
    cd flant-commercial-tutorial
    echo "  - Ветки: $(git branch | wc -l)"
    echo "  - Коммиты: $(git rev-list --count --all)"
    echo "  - Теги: $(git tag | wc -l)"
    cd ..
else
    echo "- Репозиторий не создан"
fi

# Проверка веб-приложения
if [ -d "git-trainer-quiz" ]; then
    echo "✓ Веб-приложение существует"
    if [ -f "git-trainer-quiz/src/data/encryptedAnswers.js" ]; then
        echo "  - Хеши ответов: ✓"
    else
        echo "  - Хеши ответов: ✗"
    fi
else
    echo "✗ Веб-приложение не найдено"
fi

echo "=== Конец проверки ==="
```

### Отладка хешей

Создайте файл `debug-hashes.js`:

```javascript
#!/usr/bin/env node

const crypto = require("crypto");

// Функция нормализации (такая же как в приложении)
const normalizeInput = (input) => {
  if (typeof input !== "string") {
    return "";
  }
  return input.toLowerCase().trim().replace(/\s+/g, " ");
};

// Создание хеша
const createHash = (input) => {
  const normalized = normalizeInput(input);
  return crypto.createHash("sha256").update(normalized).digest("hex");
};

// Тестирование различных вариантов ответа
const testAnswer = (answer, description) => {
  console.log(`\n${description}:`);
  console.log(`  Оригинал: "${answer}"`);
  console.log(`  Нормализован: "${normalizeInput(answer)}"`);
  console.log(`  Хеш: ${createHash(answer)}`);
};

// Примеры для тестирования
console.log("=== Отладка хешей ответов ===");

testAnswer("git show HEAD", "Команда git show HEAD");
testAnswer("git diff HEAD~1 HEAD", "Команда git diff HEAD~1 HEAD");
testAnswer("Git Show Head", "С разным регистром");
testAnswer("  git show head  ", "С лишними пробелами");
testAnswer("18%", "НДС с процентом");
testAnswer("18", "НДС без процента");
testAnswer("notes.txt", "Файл в gitignore");
testAnswer("review/tech-lead", "Название ветки");

console.log("\n=== Конец отладки ===");
```

Использование:

```bash
chmod +x debug-hashes.js
node debug-hashes.js
```

## 📊 Логирование и мониторинг

### Включение подробного логирования

В веб-приложении добавьте в консоль браузера:

```javascript
// Включить отладку валидации
window.DEBUG_VALIDATION = true;

// Посмотреть все хеши
console.table(window.encryptedAnswers);

// Протестировать конкретный ответ
window.validateAnswer("ваш ответ", window.getAnswerHash(6), "command");
```

### Сбор статистики ошибок

Добавьте в `localStorage` для отслеживания проблем:

```javascript
// Сохранение ошибки
const logError = (error, context) => {
  const errors = JSON.parse(localStorage.getItem("quiz_errors") || "[]");
  errors.push({
    timestamp: new Date().toISOString(),
    error: error.message,
    context,
    userAgent: navigator.userAgent,
  });
  localStorage.setItem("quiz_errors", JSON.stringify(errors));
};

// Просмотр ошибок
console.log(JSON.parse(localStorage.getItem("quiz_errors") || "[]"));
```

## 🆘 Получение помощи

### Информация для отчета об ошибке

При обращении за помощью предоставьте:

1. **Версия системы:**

   ```bash
   uname -a
   git --version
   bun --version
   ```

2. **Лог ошибки:**

   ```bash
   ./setup_repository.sh 2>&1 | tee setup.log
   ```

3. **Состояние репозитория:**

   ```bash
   cd flant-commercial-tutorial
   git log --oneline --graph --all
   git branch -a
   git status
   ```

4. **Консоль браузера:**
   - Откройте Developer Tools (F12)
   - Скопируйте ошибки из Console

### Самодиагностика

Перед обращением за помощью попробуйте:

1. **Полная переустановка:**

   ```bash
   rm -rf flant-commercial-tutorial git-trainer-quiz/node_modules
   ./setup_repository.sh
   cd git-trainer-quiz
   bun install
   bun run dev
   ```

2. **Проверка в другом браузере**

3. **Проверка в режиме инкогнито**

4. **Очистка кеша браузера**

### Контакты для поддержки

- **GitHub Issues**: Создайте issue с подробным описанием проблемы
- **Документация**: Проверьте [README.md](../README.md) и другие файлы в `docs/`
- **Логи**: Всегда прикладывайте логи ошибок

---

**Совет**: Большинство проблем решается пересозданием репозитория командой `./setup_repository.sh`. Это безопасная операция, которая не влияет на ваши данные.
