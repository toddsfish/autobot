import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config({
  path: '../.env',
});
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN environment variable is not set');
}

const bot = new Telegraf(token);
//console.log('Is the current bot token set', process.env.BOT_TOKEN);
bot.command('oldschool', (ctx) => ctx.reply('breasts ( . )( . )'));
bot.command('hipster', Telegraf.reply(':)'));
void bot.launch();
//console.log(bot);

// // // Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));