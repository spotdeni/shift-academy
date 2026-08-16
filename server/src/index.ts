import 'dotenv/config';
import express from 'express';
import Database from 'better-sqlite3';
import { Markup, Telegraf } from 'telegraf';

type Lead = { name: string; start: string; goal: string; time: string; contact: string };
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = Number(process.env.TELEGRAM_ADMIN_ID);
const adminUsernames = new Set((process.env.TELEGRAM_ADMIN_USERNAMES || 'maximbelov').split(',').map(value => value.trim().replace(/^@/, '').toLowerCase()).filter(Boolean));
const port = Number(process.env.PORT || 8787);
const webOrigin = process.env.WEB_ORIGIN || 'http://localhost:5173';
if (!token || !Number.isInteger(adminId) || adminId <= 0) throw new Error('Set TELEGRAM_BOT_TOKEN and numeric TELEGRAM_ADMIN_ID in server/.env');

const db = new Database('leads.db');
db.exec("CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new'); CREATE TABLE IF NOT EXISTS administrators (telegram_id INTEGER PRIMARY KEY, username TEXT, added_at TEXT NOT NULL)");
const bot = new Telegraf(token);
const isAdmin = (ctx: any) => ctx.from?.id === adminId || adminUsernames.has(String(ctx.from?.username || '').toLowerCase());
const labels: Record<string, string> = { new: 'новая', in_progress: 'в работе', postponed: 'отложена', closed: 'закрыта' };
const buttons = (id: number) => Markup.inlineKeyboard([
  [Markup.button.callback('В работу', `status:${id}:in_progress`), Markup.button.callback('Отложить', `status:${id}:postponed`)],
  [Markup.button.callback('Закрыть', `status:${id}:closed`)],
]);
const formatLead = (id: number, lead: Lead, status = 'new') => `📩 Заявка #${id}\n\nИмя: ${lead.name}\nТочка старта: ${lead.start}\nЦель: ${lead.goal}\nВремя: ${lead.time}\nTelegram: ${lead.contact}\n\nСтатус: ${labels[status] || status}`;
const asText = (value: unknown) => typeof value === 'string' ? value.trim().slice(0, 2000) : '';
const validateLead = (payload: unknown): Lead | null => {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;
  const lead = { name: asText(raw.name), start: asText(raw.start), goal: asText(raw.goal), time: asText(raw.time), contact: asText(raw.contact) };
  return Object.values(lead).every(Boolean) ? lead : null;
};

bot.start(ctx => {
  if (!isAdmin(ctx)) return ctx.reply('Доступ закрыт.');
  db.prepare('INSERT OR REPLACE INTO administrators(telegram_id, username, added_at) VALUES (?, ?, ?)').run(ctx.from.id, ctx.from.username || null, new Date().toISOString());
  return ctx.reply('Админка shift*academy подключена. Новые заявки будут приходить сюда.\n\n/leads — последние 10 заявок\n/help — помощь');
});
bot.help(ctx => isAdmin(ctx) && ctx.reply('/leads — последние 10 заявок\nКнопками под заявкой можно менять её статус.'));
bot.command('leads', async ctx => {
  if (!isAdmin(ctx)) return;
  const rows = db.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 10').all() as Array<{ id: number; payload: string; status: string }>;
  if (!rows.length) return ctx.reply('Заявок пока нет.');
  for (const row of rows) await ctx.reply(formatLead(row.id, JSON.parse(row.payload), row.status), buttons(row.id));
});
bot.action(/^status:(\d+):(in_progress|postponed|closed)$/, async ctx => {
  if (!isAdmin(ctx)) return ctx.answerCbQuery('Нет доступа');
  const [, id, status] = (ctx.callbackQuery as any).data.match(/^status:(\d+):(in_progress|postponed|closed)$/);
  const existing = db.prepare('SELECT payload, status FROM leads WHERE id = ?').get(id) as { payload: string; status: string } | undefined;
  if (!existing) return ctx.answerCbQuery('Заявка не найдена');
  if (existing.status === status) return ctx.answerCbQuery(`Уже: ${labels[status]}`);
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
  await ctx.answerCbQuery(`Статус: ${labels[status]}`);
  await ctx.editMessageText(formatLead(Number(id), JSON.parse(existing.payload), status), buttons(Number(id)));
});

const app = express();
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', webOrigin); res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); res.header('Access-Control-Allow-Headers', 'Content-Type'); if (req.method === 'OPTIONS') return res.sendStatus(204); next(); });
app.use(express.json({ limit: '32kb' }));
app.post('/api/applications', async (req, res) => {
  const lead = validateLead(req.body);
  if (!lead) return res.status(400).json({ error: 'All application fields are required.' });
  const result = db.prepare('INSERT INTO leads(created_at, payload, status) VALUES (?, ?, ?)').run(new Date().toISOString(), JSON.stringify(lead), 'new');
  const id = Number(result.lastInsertRowid);
  const recipients = new Set<number>([adminId, ...(db.prepare('SELECT telegram_id FROM administrators').all() as Array<{ telegram_id: number }>).map(row => row.telegram_id)]);
  await Promise.all([...recipients].map(recipient => bot.telegram.sendMessage(recipient, formatLead(id, lead), buttons(id)).catch(error => console.error(`Telegram notification failed for ${recipient}:`, error))));
  res.status(201).json({ id, status: 'new' });
});
app.get('/health', (_, res) => res.json({ ok: true }));
app.listen(port, () => console.log(`API listening on ${port}`));

bot.launch().then(() => console.log('Telegram bot connected')).catch(error => console.error('Telegram bot failed to start:', error));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
