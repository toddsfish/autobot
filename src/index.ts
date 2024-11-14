import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

interface Story {
  id: number;
  title: string;
  url?: string;
  foot: number;
}

// getHackerNews is an async function because it performs asynchronous operations - specifically network requests using fetch() API.
async function getHackerNews() {
  try {
    // fetch top hacker news story ids
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    //console.log(response);
    const data = await response.json() as number[];
    console.log(data);

    // Create new array of first 10 hacker rank story ids from the initial array of 500 IDs returned by fetch above.
    const first10Ids = data.slice(0, 10);

    // Creates a new array of unresolved Promise<Story> by mapping over the first 10 IDs
    // Each promise will fetch and resolve to a Story object from the Hacker News API.
    const storyPromises = first10Ids.map(async (id: number) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
      );
      return storyResponse.json() as Promise<Story>;
    });

    // Converts the array of Promise<Story> into array of Stories by waiting for all fetch requests to resolve
    const stories = await Promise.all(storyPromises);

    console.log(stories);
    return stories;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw 'Error fetching data';
  }
}

dotenv.config({
  // path to .env
  path: '../.env',
});
const token = process.env.BOT_TOKEN;
if (!token) {
  // In this specific case with checking for an environment variable token, throwing without a catch block is actually a common and reasonable pattern. If the token is missing, you typically want the application to fail fast and exit rather than continue running without required credentials
  throw new Error('BOT_TOKEN environment variable is not set');
}

const bot = new Telegraf(token);
bot.command('hackernews', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    await ctx.reply('Fetching Hacker News Top 10 Stories...');
    const hackerNews = await getHackerNews();
    //console.log(hackerNews);
    // Send each story as a separate message
    for (const story of hackerNews) {
      const message =
        `${story.title}\n` +
        `${story.url || 'No URL'}`;

      await ctx.reply(message);
    }
  } catch (error) {
    console.error('Error in hackernews command:', error);
    await ctx.reply('Sorry, there was an error fetching Hacker News stories');
  }
});
bot.command('surfreport', async (ctx) => {
  await ctx.sendChatAction('typing');
  // fetch surf report
});
void bot.launch();
console.log(bot);

//Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
