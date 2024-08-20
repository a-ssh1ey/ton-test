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

// Debounce store to prevent repeated setting for the same user
const debounceStore = new Map();

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
    const webAppUrl = `https://a-ssh1ey.github.io/ton-test/?userId=${userId}`;
  
    console.log(`Setting bot webapp URL for userId ${userId}: ${webAppUrl}`); // Debugging line

    try {
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
      );
     console.log(resp.data)
       if (resp.status === 200) {
        /*console.log(`Webapp URL set successfully for userId ${userId}`);*/
      } else {
        /*console.error(`Failed to set URL for userId ${userId}: ${resp.statusText}`);*/
      }
    } catch (error) {
      /*console.error(`Error setting webapp URL for userId ${userId}:`, error);*/
    }
  };
  
  
  const getUserId = async () => {
    try {
      const updates = await axios.get(
        `https://api.telegram.org/bot${accessToken}/getUpdates`
      );
  
      updates.data.result.forEach(update => {
        /*console.log(update);*/
        if (update.message) {
          const userId = update.message.from.id;
          setMenuButton(userId);
        }
      });
    } catch (e) {
      console.error(`Failed to get updates: ${e.message}`);
    }
  };
  
  // Poll for updates every 10 seconds
  setInterval(getUserId, 10000);
})();
