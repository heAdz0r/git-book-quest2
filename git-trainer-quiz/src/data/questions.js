window.questions = [
  {
    id: 1,
    question: "Каков хэш самого первого коммита в истории репозитория?",
    hint: "Используйте: git log --reverse или git rev-list --max-parents=0 HEAD",
    type: "hash",
  },
  {
    id: 2,
    question:
      "В разделе 'Техническое решение' было спрятано ключевое слово. Какое оно?",
    hint: "Найдите коммит с техническим решением: git log --oneline, затем git show [ХЭШ_КОММИТА]. Ищите что-то начинающееся на FLANT_",
    type: "text",
  },
  {
    id: 3,
    question: "Как называлась ветка, которая была создана для ревью тех.лида?",
    hint: "Посмотрите все ветки: git branch -a или git log --oneline --graph --all",
    type: "text",
  },
  {
    id: 4,
    question: "Какой файл был добавлен в .gitignore?",
    hint: "Посмотрите содержимое файла .gitignore: cat .gitignore",
    type: "text",
  },
  {
    id: 5,
    question:
      "Какая неправильная ставка НДС была указана изначально в разделе 'Стоимость'?",
    hint: "Найдите коммит со стоимостью и посмотрите, что было исправлено: git log --oneline, git show [ХЭШ]",
    type: "text",
  },
  {
    id: 6,
    question:
      "Какую команду нужно выполнить, чтобы увидеть изменения в последнем коммите?",
    hint: "Подумайте о команде для просмотра изменений между коммитами. Попробуйте: git show HEAD или git diff HEAD~1 HEAD",
    type: "command",
  },
  {
    id: 7,
    question: "Каков хэш коммита, где была добавлена скидка для ACME Corp?",
    hint: "Переключитесь на ветку feature/special-offer-acme: git checkout feature/special-offer-acme, затем git log --oneline",
    type: "hash",
  },
  {
    id: 8,
    question: "Как называется тег, который был создан для финальной версии?",
    hint: "Посмотрите все теги: git tag или git tag -l",
    type: "text",
  },
  {
    id: 9,
    question: "Сколько всего коммитов в ветке main?",
    hint: "Подсчитайте коммиты в main: git rev-list --count main",
    type: "number",
  },
];
