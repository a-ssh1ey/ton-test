import axios from "axios";

// Ваша API ссылка (не используется в данном примере, но оставлена для контекста)
export const APIURL = "https://assh1ey.pythonanywhere.com/";

const banner = `
▄▀▄ █▄░█ █▄░█ ▄▀▄ . ▄▀▀ ░ . ▄▀▀ ▄▀▀▄ █▀▄ █▀▄ ░
█▄█ █▀██ █▀██ █▄█ . ░▀▄ ░ . █░░ █░░█ █▀▄ █▀░ ░
▀░▀ ▀░░▀ ▀░░▀ ▀░▀ . ▀▀░ ▀ . ░▀▀ ░▀▀░ ▀░▀ ▀░░ ▀`;

console.log(banner);

const accessToken = '7456487049:AAF148xa94-xy-0xiq-1wylHQe1e3YGk3Tc'; // Замените на ваш токен
const githubUsername = 'a-ssh1ey';
const githubRepo = 'ton-test';

let lastUpdateId = 0; // Переменная для отслеживания последнего обработанного update_id

// Функция для установки меню WebApp
const setMenuButton = async (userId) => {
  const webAppUrl = `https://a-ssh1ey.github.io/ton-test/?userId=${userId}`;
  console.log(`Setting bot webapp URL for userId ${userId}: ${webAppUrl}`);

  try {
    const resp = await axios.post(
      `https://api.telegram.org/bot${accessToken}/setChatMenuButton`,
      {
        chat_id: userId,
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

// Функция для обработки обновлений
const processUpdate = async (update) => {
  if (update.message && update.message.text === '/start') {
    const userId = update.message.from.id;
    console.log(`Received /start command from userId: ${userId}`);
    await setMenuButton(userId);
  }
};

// Функция для получения обновлений с использованием длинного опроса
const getUpdates = async () => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${accessToken}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1, // Запрос обновлений начиная с последнего обработанного update_id + 1
          timeout: 30, // Длинный опрос с таймаутом 30 секунд
        },
        timeout: 35 * 1000, // Установка таймаута запроса чуть больше, чем таймаут Telegram
      }
    );

    const updates = response.data.result;

    for (const update of updates) {
      lastUpdateId = update.update_id; // Обновление последнего обработанного update_id
      await processUpdate(update); // Обработка полученного обновления
    }
  } catch (error) {
    console.error(`Error getting updates: ${error.message}`);
    // В случае ошибки можно добавить задержку перед повторной попыткой
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Функция для непрерывного получения обновлений
const startLongPolling = async () => {
  console.log("Starting long polling for updates...");
  while (true) {
    await getUpdates();
  }
};

// Запуск длинного опроса
startLongPolling();
