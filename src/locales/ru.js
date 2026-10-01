export const ru = {
  nav: { home: "Главная", assessment: "Оценка компетентности (CI)", seminars: "Новости и семинары", login: "Вход / Регистрация" },
  sidebar: {
    home: "Главная", profile: "Профиль", dashboard: "Обзор", assessments: "Оценка", employees: "Сотрудники", candidates: "Кандидаты",
    myDashboard: "Обзор", myCompetence: "Компетенции", myTests: "Тесты", training: "Обучение", myApplication: "Моя заявка", myResults: "Результаты",
    closeNavigation: "Закрыть меню", mainNavigation: "Главное меню", goToDashboard: "На главную панель",
    roles: { admin: "Администратор", employee: "Сотрудник", candidate: "Кандидат" }
  },
  hero: { title: "METSAFE", subtitle: "Цифровая модель для повышения безопасности и снижения производственного травматизма в металлургии", cta: "Начать оценку", learnMore: "Подробнее" },
  news: {
    title: "Новости и семинары", readMore: "Читать далее",
    card1: { category: "Исследование", date: "28 мая 2026 г.", title: "Компетентность и безопасность труда", desc: "Анализ связи между профессиональной подготовкой и частотой происшествий на производстве." },
    card2: { category: "Инновации", date: "15 мая 2026 г.", title: "Цифровизация металлургии", desc: "Современные цифровые технологии вместо традиционных методов обучения и проверки знаний." },
    card3: { category: "Технологии", date: "2 мая 2026 г.", title: "ИИ для прогнозирования рисков", desc: "Машинное обучение помогает выявлять сотрудников с повышенным уровнем риска и предотвращать несчастные случаи." }
  },
  aboutProject: {
    tag: "О проекте", title: "Безопасная металлургия начинается с понимания человеческого фактора",
    description: "METSAFE помогает точнее оценивать компетентность персонала, объединять разрозненные проверки безопасности и предупреждать риски с помощью цифровых инструментов.",
    sideLabel: "О нас", imageAlt: "Сотрудники металлургического предприятия",
    body1: "METSAFE создан, чтобы оценка компетентности в металлургии стала понятной, последовательной и применимой на практике. Вместо отдельных проверок и ручной интерпретации проект объединяет ключевые показатели готовности персонала в единой цифровой системе.",
    body2: "Сочетание показателей с весовыми коэффициентами, производственных критериев и факторов, связанных с персоналом, помогает определять приоритеты обучения, усиливать контроль и принимать более безопасные решения на рабочих местах с повышенным риском."
  },
  footer: {
    description: "Повышение безопасности персонала с помощью цифровой оценки компетентности", quickLinks: "Быстрые ссылки", about: "О проекте", assessment: "Начать оценку", contact: "Контакты", support: "Поддержка", faq: "Частые вопросы", privacy: "Политика конфиденциальности", copyright: "Проект METSAFE — цифровая оценка компетентности в металлургии. Все права защищены."
  },
  assessment: {
    title: "Оценка индекса компетентности (CI)", subtitle: "Расчёт компетентности персонала и уровней риска в реальном времени", description: "Подробные профили, баллы по показателям и уровни компетентности на основе модели с весовыми коэффициентами.",
    submit: "Рассчитать балл", reset: "Сбросить", input_label: "Введите балл", calculate_btn: "Рассчитать индекс CI", result_title: "Индекс компетентности", selectCandidate: "Выберите кандидата", candidateProfile: "Ключевые показатели кандидата", sidebarTitle: "Список кандидатов", yearsExp: "лет опыта", classification: "Уровень компетентности", metricsTitle: "Баллы по показателям",
    categories: { workplace: "Безопасность труда", equipment: "Эксплуатация оборудования", human: "Человеческий фактор" },
    levels: { l0: "Уровень 0 (Нет квалификации)", l1: "Уровень 1 (Начинающий)", l2: "Уровень 2 (Базовый)", l3: "Уровень 3 (Средний)", l4: "Уровень 4 (Продвинутый)", l5: "Уровень 5 (Эксперт)" },
    fields: { experience: "Стаж работы (лет)", years: "лет", certificates: "Число сертификатов", testScore: "Результат теста", incidents: "Число происшествий", majorViolation: "Серьёзное нарушение правил безопасности", yes: "Да", no: "Нет", coreMetrics: "Ключевые показатели компетентности" },
    metrics: { risk: "Оценка рисков", emergency: "Действия при ЧС", hygiene: "Промышленная гигиена", operation: "Эксплуатация печи", ppe: "Использование СИЗ", maintenance: "Обслуживание оборудования", health: "Физическое здоровье", focus: "Внимание и концентрация", teamwork: "Работа в команде" }
  },
  auth: { signIn: "Войти", register: "Регистрация", fullName: "ФИО", emailAddress: "Электронная почта", password: "Пароль", rememberMe: "Запомнить меня", forgotPassword: "Забыли пароль?", createAccount: "Создать аккаунт" },
  adminCandidates: {
    eyebrow: "Администрирование", title: "Кандидаты", description: "Просмотр учётных записей и заявок кандидатов.", addCandidate: "Добавить кандидата",
    totalCandidates: "Всего кандидатов", underReview: "На рассмотрении", approved: "Одобрено", searchPlaceholder: "Найти кандидата...", allStatuses: "Все статусы", loading: "Загрузка кандидатов...", emptyTitle: "Кандидаты не найдены", emptyDescription: "Измените запрос или фильтр по статусу.", loadError: "Не удалось загрузить список кандидатов.",
    columns: { candidate: "Кандидат", contact: "Контакты", position: "Должность", status: "Статус", actions: "Действия" },
    unnamedCandidate: "Имя не указано", noCandidateCode: "Нет кода кандидата", noEmail: "Нет электронной почты", noPhone: "Нет телефона", candidateInitial: "К", actionsFor: "Действия с кандидатом {name}",
    assignTest: "Назначить оценку", assignTitle: "Назначить оценку кандидату", chooseTest: "Выберите тест", choosePlaceholder: "Выберите тест...",
    questionCount: "вопросов в банке", randomTenQuestions: "10 случайных вопросов", notEnoughQuestions: "Менее 10 вопросов",
    cancelAssign: "Отмена", confirmAssign: "Назначить", assigning: "Назначение...", loadingTests: "Загрузка тестов...",
    noTests: "Нет активных тестов.", noModel: "Не указана версия модели", noQuestions: "Нет вопросов",
    testsError: "Не удалось загрузить тесты.", assignError: "Не удалось назначить оценку. Попробуйте ещё раз.",
    assignSuccess: "Оценка {test} назначена кандидату {name}.",
    statuses: { unknown: "Неизвестно", applied: "Подана", screening: "Рассмотрение", testing: "Тестирование", interview: "Собеседование", accepted: "Принята", rejected: "Отклонено", hired: "Принят на работу", under_review: "На рассмотрении", approved: "Одобрено", withdrawn: "Заявка отозвана", pending: "Ожидает обработки" }
  },
  adminDashboard: {
    loading: "Загрузка панели администратора...", loadError: "Не удалось загрузить данные панели администратора.", eyebrow: "Администрирование", title: "Обзор для администратора", description: "Обзор персонала, оценок и задач, требующих внимания, в METSAFE.", refreshing: "Обновление...", refresh: "Обновить данные",
    totalEmployees: "Всего сотрудников", active: "работают", totalCandidates: "Всего кандидатов", needReview: "требуют рассмотрения", completedAssessments: "Завершённые оценки", inProgress: "в работе", pendingActions: "Ожидают действий", candidateApplications: "Заявки кандидатов", needsAttention: "Требует внимания", viewAll: "Смотреть все", nothingNeedsAttention: "Новых задач нет", noPendingApplications: "Нет заявок кандидатов, ожидающих рассмотрения.", shortcuts: "Быстрый доступ", quickActions: "Быстрые действия", manageEmployees: "Управление сотрудниками", reviewCandidates: "Просмотр кандидатов", openAssessments: "Открыть оценки", unnamedCandidate: "Имя не указано", noCandidateCode: "Нет кода кандидата", candidateInitial: "К",
    statuses: { unknown: "Неизвестно", pending: "Ожидает обработки", under_review: "На рассмотрении" }
  },
  adminEmployees: {
    eyebrow: "Администрирование", title: "Сотрудники", description: "Управление данными сотрудников и информацией об их работе.", addEmployee: "Добавить сотрудника",
    totalEmployees: "Всего сотрудников", activeEmployees: "Работают", inactiveEmployees: "Не работают", searchPlaceholder: "Найти сотрудника...", allStatuses: "Все статусы", active: "Работает", inactive: "Не работает", loading: "Загрузка сотрудников...", emptyTitle: "Сотрудники не найдены", emptyDescription: "Измените запрос или фильтр.", loadError: "Не удалось загрузить список сотрудников.",
    columns: { employee: "Сотрудник", position: "Должность", experience: "Стаж", status: "Статус", actions: "Действия" },
    unnamedEmployee: "Имя не указано", noCode: "Нет кода", employeeInitial: "С", years: "лет", actionsFor: "Действия с сотрудником {name}"
  },
  profile: {
    userFallback: "Пользователь", eyebrow: "Профиль", description: "Управление данными учётной записи METSAFE.", editProfile: "Изменить профиль", accountInformation: "Данные учётной записи", accountDescription: "Обновите данные, отображаемые в профиле.", cancel: "Отмена", saving: "Сохранение...", saveChanges: "Сохранить",
    fullName: "ФИО", emailAddress: "Электронная почта", emailConfirmation: "Смена адреса требует подтверждения.", phoneNumber: "Номер телефона", phonePlaceholder: "Введите номер телефона", accountRole: "Роль", accountStatus: "Статус учётной записи", active: "Активна", inactive: "Неактивна", notAvailable: "Нет данных", notProvided: "Не указан", roleInformation: "Данные по роли", roleDescription: "Информация, связанная с вашей ролью в METSAFE.", candidateCode: "Код кандидата", applicationStatus: "Статус заявки", employeeCode: "Код сотрудника", department: "Отдел", accessLevel: "Уровень доступа", systemAdministrator: "Системный администратор", notAvailableYet: "Пока нет данных",
    messages: { nameRequired: "Укажите ФИО.", sessionUnavailable: "Сеанс пользователя недоступен.", updateFailed: "Не удалось обновить профиль.", updated: "Профиль обновлён." }
  },
  candidateApplication: {
    loading: "Загрузка заявки...", errorTitle: "Не удалось загрузить заявку", tryAgain: "Повторить",
    errors: { sessionUnavailable: "Сеанс пользователя недоступен.", profileNotLinked: "Профиль кандидата ещё не привязан к аккаунту.", loadError: "Не удалось загрузить заявку." },
    eyebrow: "Раздел кандидата", title: "Моя заявка", description: "Следите за статусом заявки и проверяйте отправленные данные.", refreshing: "Обновление...", refresh: "Обновить", currentStatus: "Текущий статус заявки", progress: "Этапы", journey: "Рассмотрение заявки",
    steps: {
      submitted: { title: "Заявка подана", description: "Ваш профиль кандидата создан." },
      review: { title: "Рассмотрение заявки", description: "Отдел подбора персонала проверяет ваши данные." },
      assessment: { title: "Оценка компетентности", description: "Вас могут пригласить пройти оценку компетентности." },
      decision: { title: "Итоговое решение", description: "Отдел подбора персонала сообщит результат." }
    },
    applicationDetails: "Данные заявки", submittedInformation: "Отправленные сведения", candidateCode: "Код кандидата", emailAddress: "Электронная почта", phoneNumber: "Номер телефона", position: "Должность", submittedOn: "Дата подачи", notAssigned: "Не присвоен", notProvided: "Не указан", notSpecified: "Не указана", notAvailable: "Нет данных", nextStep: "Следующий шаг", reviewProfile: "Открыть профиль",
    statuses: { unknown: "Неизвестно", pending: "Ожидает рассмотрения", under_review: "На рассмотрении", approved: "Одобрена", interview: "Собеседование", accepted: "Принята", rejected: "Отклонена", withdrawn: "Отозвана" },
    statusDescriptions: {
      unknown: "Статус заявки пока недоступен.", pending: "Заявка подана и ожидает рассмотрения.", under_review: "Отдел подбора персонала рассматривает вашу заявку.", approved: "Заявка прошла первичное рассмотрение.", interview: "Заявка перешла на этап собеседования.", accepted: "Поздравляем! Ваша заявка принята.", rejected: "На этом этапе ваша заявка не прошла отбор.", withdrawn: "Эта заявка больше не активна."
    },
    nextSteps: {
      unknown: { title: "Обновите профиль", description: "Проверьте актуальность личных данных." },
      pending: { title: "Дождитесь рассмотрения", description: "Сейчас действий не требуется. Статус изменится после начала проверки." },
      under_review: { title: "Заявка рассматривается", description: "Проверьте контактные данные на случай, если понадобятся дополнительные сведения." },
      approved: { title: "Подготовьтесь к оценке", description: "Следующим этапом может стать оценка компетентности или знаний по безопасности." },
      interview: { title: "Подготовьтесь к собеседованию", description: "Проверьте контактные данные, чтобы не пропустить дальнейшую информацию." },
      accepted: { title: "Ожидайте дальнейших инструкций", description: "Отдел подбора персонала сообщит о следующем этапе." },
      rejected: { title: "Обновите профиль", description: "Поддерживайте данные в актуальном состоянии для будущих вакансий." },
      withdrawn: { title: "Проверьте профиль", description: "Поддерживайте личные данные в актуальном состоянии." }
    }
  },
  candidateDashboard: {
    loading: "Загрузка страницы кандидата...", errorTitle: "Не удалось загрузить страницу", tryAgain: "Повторить", eyebrow: "Раздел кандидата", welcomeBack: "С возвращением,", candidateFallback: "Кандидат", description: "Отслеживайте заявку и результаты оценки в одном месте.", refreshing: "Обновление...", refresh: "Обновить", applicationStatus: "Статус заявки", candidateCode: "Код кандидата", assessment: "Оценка", notAssigned: "Не присвоен", notStarted: "Не начата", applicationJourney: "Рассмотрение заявки", applicationProgress: "Этапы заявки",
    steps: { submitted: "Заявка подана", underReview: "Заявка рассматривается", assessment: "Оценка", finalDecision: "Итоговое решение" },
    nextStep: "Следующий шаг", keepProfileReady: "Проверьте профиль", contactReminder: "Убедитесь, что контактные данные указаны верно и с вами можно связаться.", reviewProfile: "Открыть профиль", competenceAssessment: "Оценка компетентности", latestAssessment: "Последний результат оценки", noAssessment: "Оценки пока нет", resultPending: "Результат появится здесь, когда будет готов.", assessmentStatus: "Статус оценки", totalScore: "Общий балл", level: "Уровень", notClassified: "Не определён", viewResults: "Посмотреть результаты",
    statuses: { unknown: "Неизвестно", pending: "Ожидает рассмотрения", under_review: "На рассмотрении", approved: "Одобрена", interview: "Собеседование", accepted: "Принята", rejected: "Отклонена", withdrawn: "Отозвана", completed: "Завершена", cancelled: "Отменена", in_progress: "В процессе" }
  },
  candidateTests: {
    loading: "Загрузка заданий...", errorTitle: "Не удалось загрузить задания", tryAgain: "Повторить", eyebrow: "Раздел кандидата", title: "Мои задания", description: "Проходите назначенные оценки и отслеживайте результаты.", refreshing: "Обновление...", refresh: "Обновить",
    assignedTests: "Назначено", inProgress: "В процессе", completed: "Завершено", averageScore: "Средний балл", recommendedAction: "Следующее действие", continueDescription: "Продолжите начатую оценку.", startDescription: "Эту оценку можно начать.", continueTest: "Продолжить", startTest: "Начать", assessmentCentre: "Центр оценки", availableTests: "Доступные задания", candidateFallback: "Кандидат",
    filters: { all: "Все", pending: "Ожидают", inProgress: "В процессе", completed: "Завершены" }, emptyTitle: "Заданий пока нет", emptyDescription: "Назначенные оценки появятся здесь, когда станут доступны.",
    howItWorks: "Как проходит оценка", howItWorksDescription: "METSAFE учитывает знания, практические навыки, соблюдение правил безопасности, опыт, историю происшествий, психологическую готовность и результаты оценки.", ciExplanation: "Индекс компетентности (CI) рассчитывается по шкале 0–100 и соответствует уровням 0–5.", assessmentTitle: "Оценка компетентности", defaultAssessmentTitle: "Оценка компетентности METSAFE", assessmentCategory: "Оценка компетентности и безопасности", assignedAssessment: "Назначенная оценка", score: "Балл", viewResult: "Посмотреть результат", continue: "Продолжить", start: "Начать",
    statuses: { pending: "Ожидает", assigned: "Назначена", started: "Начата", in_progress: "В процессе", completed: "Завершена", cancelled: "Отменена" }
  }
};