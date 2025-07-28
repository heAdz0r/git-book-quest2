# Расширение системы новыми сценариями

Это руководство описывает, как добавить новые Git-сценарии в систему обучения "Управляем КП".

## 📋 Обзор

Система построена модульно, что позволяет легко добавлять новые сценарии обучения. Каждый сценарий представляет собой набор Git-операций, которые создают определенную историю коммитов для изучения конкретных концепций Git.

## 🏗️ Архитектура расширения

### Компоненты для расширения

1. **Bash-функции** в `setup_repository.sh`
2. **Вопросы** в `git-trainer-quiz/src/data/questions.js`
3. **Хеши ответов** в `git-trainer-quiz/src/data/encryptedAnswers.js`
4. **Скрипт обновления** `git-trainer-quiz/scripts/update-answers.cjs`

## 🔧 Добавление нового сценария

### Шаг 1: Планирование сценария

Определите:

- **Цель обучения** (например, изучение rebase, cherry-pick, stash)
- **Git-операции** для демонстрации концепции
- **Ключевые моменты** для проверки знаний
- **Количество вопросов** (рекомендуется 2-4 на сценарий)

### Шаг 2: Создание bash-функции

Добавьте новую функцию в `setup_repository.sh`:

```bash
# Пример: сценарий для изучения rebase
create_rebase_scenario() {
    log_info "Создание сценария для изучения rebase..."

    # Создание ветки для rebase
    git checkout -b feature/rebase-demo

    # Несколько коммитов для демонстрации
    echo "Новая функция A" >> "$MAIN_FILE"
    git add "$MAIN_FILE"
    git commit -m "Feat: Добавлена функция A"

    echo "Новая функция B" >> "$MAIN_FILE"
    git add "$MAIN_FILE"
    git commit -m "Feat: Добавлена функция B"

    # Переключение на main и создание конфликтующего коммита
    git checkout main
    echo "Исправление в main" >> "$MAIN_FILE"
    git add "$MAIN_FILE"
    git commit -m "Fix: Исправление в main"

    # Возврат на feature ветку для rebase
    git checkout feature/rebase-demo

    # Захват данных для вопросов
    REBASE_BRANCH_NAME="feature/rebase-demo"
    COMMITS_BEFORE_REBASE=$(git rev-list --count HEAD)

    log_success "Сценарий rebase создан"
}
```

### Шаг 3: Интеграция в основной поток

Добавьте вызов функции в `main()`:

```bash
main() {
    # ... существующие вызовы ...
    create_special_offer_branch
    create_final_tag
    create_rebase_scenario  # Новый сценарий
    update_quiz_answers
    display_results
}
```

### Шаг 4: Обновление захвата ключей

Добавьте новые переменные в функцию `update_quiz_answers()`:

```bash
update_quiz_answers() {
    # ... существующий код ...

    # Новые ключи для rebase сценария
    echo "   Task 10 (ветка rebase): $REBASE_BRANCH_NAME"
    echo "   Task 11 (коммиты до rebase): $COMMITS_BEFORE_REBASE"
}
```

## 📝 Добавление вопросов для нового сценария

### Обновление questions.js

Добавьте новые вопросы в `git-trainer-quiz/src/data/questions.js`:

```javascript
window.questions = [
  // ... существующие вопросы ...
  {
    id: 10,
    question: "Как называется ветка, созданная для демонстрации rebase?",
    hint: "Посмотрите все ветки: git branch -a",
    type: "text",
  },
  {
    id: 11,
    question: "Сколько коммитов было в ветке до выполнения rebase?",
    hint: "Переключитесь на ветку и подсчитайте: git checkout feature/rebase-demo && git rev-list --count HEAD",
    type: "number",
  },
];
```

### Обновление скрипта генерации хешей

Модифицируйте `git-trainer-quiz/scripts/update-answers.cjs`:

```javascript
// Добавьте получение новых данных
const rebaseBranch = "feature/rebase-demo";
gitCommand(`git checkout ${rebaseBranch}`);
const commitsBeforeRebase = gitCommand("git rev-list --count HEAD");
gitCommand("git checkout main");

// Добавьте в объект encryptedAnswers
const encryptedAnswers = {
  // ... существующие ответы ...
  task10: createAnswerHash(rebaseBranch),
  task11: createAnswerHash(commitsBeforeRebase),
};

// Обновите генерацию файла
const fileContent = `// ... существующий контент ...

  // task10: ветка rebase "${rebaseBranch}"
  task10: "${encryptedAnswers.task10}",

  // task11: коммиты до rebase "${commitsBeforeRebase}"
  task11: "${encryptedAnswers.task11}",
`;
```

## 🎨 Типы сценариев

### 1. Сценарий ветвления

Демонстрирует создание, переключение и слияние веток:

```bash
create_branching_scenario() {
    # Создание нескольких веток
    git checkout -b feature/branch-a
    # ... коммиты ...

    git checkout main
    git checkout -b feature/branch-b
    # ... коммиты ...

    # Слияние с разными стратегиями
    git checkout main
    git merge feature/branch-a --no-ff
    git merge feature/branch-b --squash
}
```

### 2. Сценарий конфликтов

Создает ситуации с конфликтами слияния:

```bash
create_conflict_scenario() {
    # Создание конфликтующих изменений
    git checkout -b feature/conflict-demo
    sed -i 's/старый текст/новый текст A/' "$MAIN_FILE"
    git commit -am "Change: версия A"

    git checkout main
    sed -i 's/старый текст/новый текст B/' "$MAIN_FILE"
    git commit -am "Change: версия B"

    # Попытка слияния создаст конфликт
    git merge feature/conflict-demo || true
}
```

### 3. Сценарий истории

Демонстрирует работу с историей коммитов:

```bash
create_history_scenario() {
    # Создание сложной истории
    for i in {1..5}; do
        echo "Изменение $i" >> "$MAIN_FILE"
        git commit -am "Update: изменение $i"
    done

    # Интерактивный rebase (симуляция)
    git reset --soft HEAD~3
    git commit -m "Squash: объединение последних 3 коммитов"
}
```

## 🔍 Тестирование нового сценария

### Локальное тестирование

```bash
# Запуск с новым сценарием
./setup_repository.sh

# Проверка созданной структуры
cd flant-commercial-tutorial
git log --oneline --graph --all
git branch -a
git status

# Тестирование вопросов
cd ../git-trainer-quiz
bun run dev
```

### Автоматическое тестирование

Создайте тестовую функцию:

```bash
test_new_scenario() {
    echo "Тестирование нового сценария..."

    # Проверка существования ветки
    if git branch | grep -q "feature/rebase-demo"; then
        echo "✓ Ветка создана"
    else
        echo "✗ Ветка не найдена"
        exit 1
    fi

    # Проверка количества коммитов
    local commit_count=$(git rev-list --count feature/rebase-demo)
    if [ "$commit_count" -gt 0 ]; then
        echo "✓ Коммиты созданы: $commit_count"
    else
        echo "✗ Коммиты не найдены"
        exit 1
    fi
}
```

## 📊 Мониторинг и аналитика

### Отслеживание использования

Добавьте логирование в веб-приложение:

```javascript
// В QuestionComponent.jsx
const handleAnswerSubmit = (answer) => {
  // Логирование попыток ответа
  console.log(`Question ${questionId}: attempt with answer "${answer}"`);

  // Отправка аналитики (опционально)
  if (window.analytics) {
    window.analytics.track("question_attempted", {
      questionId,
      scenarioType: "rebase", // новый тип сценария
      isCorrect: validateAnswer(answer, correctHash),
    });
  }
};
```

## 🚀 Развертывание изменений

### Обновление существующих установок

```bash
# Скрипт обновления для пользователей
#!/bin/bash
echo "Обновление Git-тренажера..."

# Обновление скрипта
git pull origin main

# Пересоздание репозитория с новыми сценариями
./setup_repository.sh

# Обновление веб-приложения
cd git-trainer-quiz
bun install
bun run build

echo "Обновление завершено!"
```

## 📋 Чек-лист для нового сценария

- [ ] Определена цель обучения
- [ ] Создана bash-функция сценария
- [ ] Добавлены вопросы в questions.js
- [ ] Обновлен скрипт генерации хешей
- [ ] Протестирован локально
- [ ] Обновлена документация
- [ ] Добавлены тесты (если необходимо)
- [ ] Проверена совместимость с существующими сценариями

## 🔧 Продвинутые техники

### Условные сценарии

Создание сценариев, которые активируются по параметрам:

```bash
# В setup_repository.sh
ENABLE_ADVANCED_SCENARIOS=${1:-false}

if [ "$ENABLE_ADVANCED_SCENARIOS" = "true" ]; then
    create_rebase_scenario
    create_cherry_pick_scenario
    create_stash_scenario
fi
```

### Модульные сценарии

Разделение сценариев на отдельные файлы:

```bash
# scenarios/rebase.sh
source "$(dirname "$0")/scenarios/rebase.sh"
source "$(dirname "$0")/scenarios/conflicts.sh"
```

### Параметризованные сценарии

Создание настраиваемых сценариев:

```bash
create_custom_scenario() {
    local scenario_name=$1
    local commit_count=$2
    local branch_prefix=$3

    for i in $(seq 1 $commit_count); do
        git checkout -b "${branch_prefix}-${i}"
        echo "Feature $i" >> "$MAIN_FILE"
        git commit -am "Feat: добавлена функция $i"
        git checkout main
    done
}
```

## 📚 Дополнительные ресурсы

- [Git Documentation](https://git-scm.com/doc)
- [React Documentation](https://reactjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Bash Scripting Guide](https://tldp.org/LDP/abs/html/)

---

**Совет**: Начните с простых сценариев и постепенно добавляйте сложность. Всегда тестируйте новые сценарии на чистой системе перед развертыванием.
