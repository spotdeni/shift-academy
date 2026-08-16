# system/lab

Лендинг и интерактивная анкета для обучения системному анализу.

## Запуск

```bash
npm install
npm run dev
```

## Telegram-бот и админка

Добавлен backend в `server/`. Он хранит заявки в SQLite и отправляет их администратору в Telegram с inline-кнопками статусов. Токен никогда не должен находиться во frontend, Git или сообщениях чата.

1. В `@BotFather` отзовите токен, который был отправлен в переписке, и создайте новый.
2. Узнайте numeric Telegram ID аккаунта администратора (username `@denismorodinov` — только подсказка, не механизм авторизации).
3. Выполните:

```bash
cd server
cp .env.example .env
# заполните TELEGRAM_BOT_TOKEN и TELEGRAM_ADMIN_ID
npm install
npm run dev
```

API принимает `POST /api/applications`, бот поддерживает `/start`, `/help`, `/leads` и кнопки «В работу», «Отложить», «Закрыть». Тестировать можно через `curl`:

```bash
curl -X POST http://localhost:8787/api/applications -H 'content-type: application/json' -d '{"name":"Тест","goal":"Войти в IT","contact":"@candidate"}'
```

Для production добавьте reverse proxy/HTTPS, ограничения CORS, резервное копирование SQLite и webhook Telegram вместо long polling.

Перед запуском рекламы замените шаблон оферты, реквизиты и проверьте рекламные claims.
