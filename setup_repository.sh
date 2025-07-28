#!/bin/bash

# Скрипт для создания Git-репозитория с историей коммерческого предложения
# и обновления хешей ответов в веб-приложении

set -e  # Остановка при ошибке

# Конфигурация
REPO_NAME="flant-commercial-tutorial"
AUTHOR_NAME="Андрей Спрогис"
AUTHOR_EMAIL="andrey.sprogis@flant.ru"
MAIN_FILE="book.txt"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка зависимостей
check_dependencies() {
    log_info "Проверка зависимостей..."
    
    if ! command -v git &> /dev/null; then
        log_error "Git не установлен"
        exit 1
    fi
    
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    if [[ $(echo "$GIT_VERSION 2.20" | tr ' ' '\n' | sort -V | head -n1) != "2.20" ]]; then
        log_error "Требуется Git версии 2.20 или выше (текущая: $GIT_VERSION)"
        exit 1
    fi
    
    if ! command -v bun &> /dev/null; then
        log_error "Bun не установлен"
        exit 1
    fi
    
    log_success "Все зависимости установлены"
}

# Очистка существующего репозитория
cleanup_existing() {
    if [ -d "$REPO_NAME" ]; then
        log_warning "Удаление существующего репозитория $REPO_NAME"
        rm -rf "$REPO_NAME"
    fi
}

# Инициализация репозитория
init_repository() {
    log_info "Инициализация Git-репозитория..."
    
    mkdir "$REPO_NAME"
    cd "$REPO_NAME"
    
    git init
    git config user.name "$AUTHOR_NAME"
    git config user.email "$AUTHOR_EMAIL"
    
    log_success "Репозиторий инициализирован"
}

# Создание коммитов в main ветке
create_main_commits() {
    log_info "Создание коммитов в main ветке..."
    
    # Первый коммит - инициализация структуры
    cat > "$MAIN_FILE" << 'EOF'
# Коммерческое предложение для компании "Рога и Копыта"

## Введение

Данное коммерческое предложение представляет решение для автоматизации бизнес-процессов.

## Описание проблемы

Компания "Рога и Копыта" сталкивается с необходимостью оптимизации рабочих процессов.
EOF
    
    git add "$MAIN_FILE"
    git commit -m "Draft: Инициализация структуры коммерческого предложения"
    
    # Захват хеша первого коммита
    FIRST_COMMIT_HASH=$(git rev-list --max-parents=0 HEAD)
    
    # Второй коммит - добавление технического решения с ключевым словом
    cat >> "$MAIN_FILE" << 'EOF'

## Техническое решение

Наше решение обеспечивает полную прозрачность всех бизнес-процессов и позволяет:
- Автоматизировать рутинные операции
- Повысить эффективность работы сотрудников
- Обеспечить контроль качества
EOF
    
    git add "$MAIN_FILE"
    git commit -m "Update: Добавлен раздел с техническим решением"
    
    log_success "Основные коммиты созданы"
}

# Создание ветки для ревью
create_review_branch() {
    log_info "Создание ветки для ревью..."
    
    git checkout -b review/tech-lead
    
    cat >> "$MAIN_FILE" << 'EOF'

## Сроки реализации

Предварительные сроки реализации проекта: 3 месяца
EOF
    
    git add "$MAIN_FILE"
    git commit -m "Review: Добавлены предварительные сроки реализации"
    
    log_success "Ветка review/tech-lead создана"
}

# Настройка .gitignore в main
setup_gitignore() {
    log_info "Настройка .gitignore в main ветке..."
    
    git checkout main
    
    cat > .gitignore << 'EOF'
notes.txt
*.tmp
EOF
    
    echo "Не забыть уточнить бюджет у клиента" > notes.txt
    
    git add .gitignore
    git commit -m "Infra: Настроен файл gitignore для служебных заметок"
    
    log_success ".gitignore настроен"
}

# Слияние ветки ревью
merge_review_branch() {
    log_info "Слияние ветки review/tech-lead..."
    
    git merge review/tech-lead --no-ff -m "Merge: Интеграция изменений после ревью тех.лида"
    
    log_success "Ветка review/tech-lead слита"
}

# Добавление стоимости с ошибкой НДС
add_cost_with_error() {
    log_info "Добавление стоимости с неправильным НДС..."
    
    cat >> "$MAIN_FILE" << 'EOF'

## Стоимость

Стоимость реализации проекта: 1,000,000 руб. (включая НДС 18%)
EOF
    
    git add "$MAIN_FILE"
    git commit -m "Update: Добавлен раздел со стоимостью"
    
    log_success "Стоимость добавлена"
}

# Исправление ставки НДС
fix_vat_rate() {
    log_info "Исправление ставки НДС..."
    
    sed -i 's/НДС 18%/НДС 20%/g' "$MAIN_FILE"
    
    git add "$MAIN_FILE"
    git commit -m "Fix: Скорректирована ставка НДС на актуальную"
    
    log_success "Ставка НДС исправлена"
}

# Создание ветки для специального предложения
create_special_offer_branch() {
    log_info "Создание ветки для специального предложения..."
    
    git checkout -b feature/special-offer-acme
    
    sed -i 's/Рога и Копыта/ACME Corp/g' "$MAIN_FILE"
    
    cat >> "$MAIN_FILE" << 'EOF'

## Специальное предложение

Для компании ACME Corp предоставляется специальная скидка 15% на все услуги.
EOF
    
    git add "$MAIN_FILE"
    git commit -m "Feat: Адаптация КП и добавление скидки для ACME Corp"
    
    # Захват хеша коммита со скидкой ACME
    ACME_COMMIT_HASH=$(git rev-parse HEAD)
    
    log_success "Ветка feature/special-offer-acme создана"
}

# Создание тега для финальной версии
create_final_tag() {
    log_info "Создание тега для финальной версии..."
    
    git checkout main
    
    git tag -a v1.0-sent -m 'Финальная версия КП, отправленная клиенту "Рога и Копыта"'
    
    log_success "Тег v1.0-sent создан"
}

# Подсчет коммитов и обновление хешей
update_quiz_answers() {
    log_info "Обновление хешей ответов в веб-приложении..."
    
    # Подсчет коммитов в main
    COMMIT_COUNT=$(git rev-list --count main)
    
    # Переход в директорию веб-приложения
    cd ../git-trainer-quiz
    
    # Проверка существования скрипта обновления
    if [ ! -f "scripts/update-answers.js" ]; then
        log_error "Скрипт обновления ответов не найден"
        exit 1
    fi
    
    # Обновление хешей
    if bun run scripts/update-answers.js "$FIRST_COMMIT_HASH" "$ACME_COMMIT_HASH" "$COMMIT_COUNT"; then
        log_success "Хеши ответов обновлены"
    else
        log_error "Ошибка при обновлении хешей ответов"
        exit 1
    fi
    
    cd ..
}

# Отображение результатов
display_results() {
    log_info "Результаты создания репозитория:"
    echo
    echo "📁 Репозиторий: $REPO_NAME"
    echo "👤 Автор: $AUTHOR_NAME <$AUTHOR_EMAIL>"
    echo
    echo "🔑 Ключи ответов для викторины:"
    echo "   Task 1 (первый коммит): $FIRST_COMMIT_HASH"
    echo "   Task 2 (ключевое слово): прозрачность"
    echo "   Task 3 (ветка ревью): review/tech-lead"
    echo "   Task 4 (файл в .gitignore): notes.txt"
    echo "   Task 5 (неправильный НДС): 18%"
    echo "   Task 6 (команда diff): git diff HEAD~1 HEAD"
    echo "   Task 7 (коммит ACME): $ACME_COMMIT_HASH"
    echo "   Task 8 (тег): v1.0-sent"
    echo "   Task 9 (количество коммитов): $COMMIT_COUNT"
    echo
    echo "🚀 Для запуска викторины:"
    echo "   cd git-trainer-quiz"
    echo "   bun run dev"
    echo
    log_success "Репозиторий готов для обучения!"
}

# Основная функция
main() {
    echo "🎯 Создание Git-репозитория для обучения"
    echo "=========================================="
    echo
    
    check_dependencies
    cleanup_existing
    init_repository
    create_main_commits
    create_review_branch
    setup_gitignore
    merge_review_branch
    add_cost_with_error
    fix_vat_rate
    create_special_offer_branch
    create_final_tag
    update_quiz_answers
    display_results
}

# Запуск основной функции
main "$@"