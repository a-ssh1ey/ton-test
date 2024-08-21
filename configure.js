import axios from "axios";
import { createInterface } from "readline";
import fs from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function exitError(error) {
  console.error(`Error! ${error}`);
  process.exit(1);
}

const banner = `
▄▀▄ █▄░█ █▄░█ ▄▀▄ . ▄▀▀ ░ . ▄▀▀ ▄▀▀▄ █▀▄ █▀▄ ░
█▄█ █▀██ █▀██ █▄█ . ░▀▄ ░ . █░░ █░░█ █▀▄ █▀░ ░
▀░▀ ▀░░▀ ▀░░▀ ▀░▀ . ▀▀░ ▀ . ░▀▀ ░▀▀░ ▀░▀ ▀░░ ▀`;

console.log(banner);

const accessToken = '7456487049:AAF148xa94-xy-0xiq-1wylHQe1e3YGk3Tc';
const githubUsername = 'a-ssh1ey';
const githubRepo = 'ton-test';

let botUsername;
let lastUpdateId = 0; // Переменная для отслеживания последнего обработанного update_id

const debounceTime = 10000; // 10 секунд
const debounceStore = new Map();

// Function to reset the menu button to default
const resetMenuButton = async (userId) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${accessToken}/setChatMenuButton`,
      {
        menu_button: {
          type: "default",
        },
      }
    );
    console.log(`Menu button reset to default for userId ${userId}`);
  } catch (error) {
    console.error(`Error resetting menu button for userId ${userId}:`, error);
  }
};

// Function to set the menu button for a specific userId
const setMenuButton = async (userId) => {
  const lastSetTime = debounceStore.get(userId);
  const currentTime = Date.now();

  if (lastSetTime && currentTime - lastSetTime < debounceTime) {
    console.log(`Skipping setting button for userId ${userId} due to debounce`);
    return;
  }

  debounceStore.set(userId, currentTime);

  const webAppUrl = `https://a-ssh1ey.github.io/ton-test/?userId=${userId}`;
  console.log(`Setting bot webapp URL for userId ${userId}: ${webAppUrl}`);

  try {
    await resetMenuButton(userId); // Reset to default before setting the new URL

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

    if (resp.status === 200) {
      console.log(`Webapp URL set successfully for userId ${userId}`);
    } else {
      console.error(`Failed to set URL for userId ${userId}: ${resp.statusText}`);
    }
  } catch (error) {
    console.error(`Error setting webapp URL for userId ${userId}:`, error);
  }
};

// Function to check the current menu button status for a specific userId
const checkMenuButton = async (userId) => {
  try {
    const resp = await axios.get(
      `https://api.telegram.org/bot${accessToken}/getChatMenuButton`,
      {
        params: {
          chat_id: userId,
        },
      }
    );
    console.log(`Menu button for userId ${userId}:`, resp.data);
  } catch (error) {
    console.error(`Error retrieving menu button for userId ${userId}:`, error);
  }
};

// Function to process updates and set menu buttons
const getUserId = async () => {
  try {
    const updates = await axios.get(
      `https://api.telegram.org/bot${accessToken}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1, // Запрашиваем обновления, начиная с последнего обработанного update_id + 1
        },
      }
    );

    for (const update of updates.data.result) {
      lastUpdateId = update.update_id; // Обновляем последний обработанный update_id
      if (update.message) {
        const userId = update.message.from.id;
        console.log(`Processing update for userId: ${userId}`);
        await setMenuButton(userId); // Ждем завершения установки кнопки для текущего пользователя

        // Optionally check if the menu button was set correctly
        await checkMenuButton(userId);
      }
    }
  } catch (e) {
    console.error(`Failed to get updates: ${e.message}`);
  }
};

// Poll for updates every 10 seconds
const intervalId = setInterval(getUserId, 10000);

// Пример остановки интервала при завершении работы скрипта
process.on('SIGINT', () => {
  clearInterval(intervalId);
  rl.close();
  process.exit(0);
});
