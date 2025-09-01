#!/bin/bash

# Скрипт для создания тестового релиза в git-book-quest2

set -e

# Проверяем, что мы в правильной директории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Запустите скрипт из корня git репозитория"
    exit 1
fi

# Получаем текущую ветку
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Текущая ветка: $CURRENT_BRANCH"

# Генерируем уникальный тег
TIMESTAMP=$(date +%s)
TAG="v1.0.$TIMESTAMP"
TITLE="Test Release $TAG"
NOTES="🧪 Тестовый релиз для проверки webhook'ов

Создан: $(date)
Ветка: $CURRENT_BRANCH
Коммит: $(git rev-parse --short HEAD)

Этот релиз создан автоматически для тестирования системы мониторинга GitHub релизов."

echo "🏷️  Создаем тег: $TAG"

# Создаем аннотированный тег
git tag -a "$TAG" -m "$TITLE"

echo "📤 Отправляем тег на GitHub..."

# Отправляем тег
git push origin "$TAG"

echo "✅ Тег $TAG успешно создан и отправлен!"

# Проверяем, установлен ли GitHub CLI
if command -v gh &> /dev/null; then
    echo "🚀 Создаем релиз через GitHub CLI..."
    
    # Создаем релиз
    gh release create "$TAG" \
        --title "$TITLE" \
        --notes "$NOTES" \
        --latest
    
    echo "🎉 Релиз $TAG успешно создан!"
    echo "🔗 Ссылка: https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name')/releases/tag/$TAG"
else
    echo "⚠️  GitHub CLI не установлен. Создайте релиз вручную:"
    echo "   1. Перейдите на https://github.com/heAdz0r/git-book-quest2/releases"
    echo "   2. Нажмите 'Create a new release'"
    echo "   3. Выберите тег: $TAG"
    echo "   4. Заполните название и описание"
    echo "   5. Опубликуйте релиз"
fi

echo ""
echo "📊 Для проверки webhook'а:"
echo "   • Откройте http://localhost:3000"
echo "   • Проверьте логи сервера"
echo "   • Посмотрите события в интерфейсе"