import axios from "axios";
import { createInterface } from "readline";
import fs from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

function exitError(error) {
  console.error(`Error! ${error}`);
  process.exit(1);
}

const banner = `
▄▀▄ █▄░█ █▄░█ ▄▀▄ . ▄▀▀ ░ . ▄▀▀ ▄▀▀▄ █▀▄ █▀▄ ░
█▄█ █▀██ █▀██ █▄█ . ░▀▄ ░ . █░░ █░░█ █▀▄ █▀░ ░
▀░▀ ▀░░▀ ▀░░▀ ▀░▀ . ▀▀░ ▀ . ░▀▀ ░▀▀░ ▀░▀ ▀░░ ▀`;

console.log(banner);

let githubUsername, githubRepo, botUsername;

(async () => {
  try {
    const file = fs.readFileSync(".git/config").toString();
    const url = file.match(/url = (.*)/)[1];
    const params = url.match(/github.com[/:]([^/]*)\/(.*)\.git/);
    githubUsername = params[1];
    githubRepo = params[2];
  } catch (e) {}

  const accessToken = '7528353122:AAHXZoQ8OAeWa3IIm0rWdwmKl9NeifDI7Po';
 
  const githubUsernameQ = await question(
    `Enter your github username${
      githubUsername ? ` (${githubUsername})` : ``
    }: `
  );
  githubUsername = githubUsernameQ || githubUsername;
  if (!githubUsername?.length > 0) exitError("Github username is required");

  const githubRepoQ = await question(
    `Enter your forked repo name${githubRepo ? ` (${githubRepo})` : ``}: `
  );
  githubRepo = githubRepoQ || githubRepo;
  if (!githubRepo?.length > 0) exitError("Repo name is required");

  const getBot = await axios.get(
    `https://api.telegram.org/bot${accessToken}/getMe`
  ).catch(exitError);

  botUsername = getBot.data.result.username;
  const url = `https://${githubUsername}.github.io/${githubRepo}`;

  const setMenuButton = async (userId) => {
    const webAppUrl = `${url}?userId=${userId}`;
    console.log(`Setting bot ${botUsername} webapp url to ${webAppUrl}`);
  
    const resp = await axios.post(
      `https://api.telegram.org/bot${accessToken}/setChatMenuButton`,
      {
        menu_button: {
          type: "web_app",
          text: "Launch Webapp",
          web_app: {
            url: webAppUrl,
          },
        },
      }
    ).catch(exitError);
  
    if (resp.status === 200) {
      console.log(`User ${userId} is all set! Visit https://t.me/${botUsername} to interact with your bot`);
    } else {
      console.error(`Failed to set URL for user ${userId}: ${resp.error}`);
    }
  };
  
  const getUserId = async () => {
    try {
      const updates = await axios.get(
        `https://api.telegram.org/bot${accessToken}/getUpdates`
      );
  
      updates.data.result.forEach(update => {
        if (update.message) {
          const userId = update.message.from.id;
          setMenuButton(userId);
        }
      });
    } catch (e) {
      console.error(`Failed to get updates: ${e.message}`);
    }
  };
  
  // Poll for updates every 5 seconds
  setInterval(getUserId, 5000);
  