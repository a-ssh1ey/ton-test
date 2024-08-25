import axios from "axios";

export const APIURL = "https://assh1ey.pythonanywhere.com/";

// Removed readline interface creation as it seems unnecessary
// const rl = createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

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

let lastUpdateId = 0; // Variable to track the last processed update_id

const setMenuButton = async (userId) => {
  const webAppUrl = `https://a-ssh1ey.github.io/ton-test/?userId=${userId}`;
  console.log(`Setting bot webapp URL for userId ${userId}: ${webAppUrl}`);

  try {
    const resp = await axios.post(
      `https://api.telegram.org/bot${accessToken}/setChatMenuButton`,
      {
        chat_id: userId, // Explicitly specify the user chat ID
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

// Function to process updates and set menu buttons
const getUserId = async () => {
  try {
    const updates = await axios.get(
      `https://api.telegram.org/bot${accessToken}/getUpdates`,
      {
        params: {
          offset: lastUpdateId + 1, // Request updates starting from the last processed update_id + 1
        },
      }
    );

    for (const update of updates.data.result) {
      lastUpdateId = update.update_id; // Update the last processed update_id
      if (update.message) {
        const userId = update.message.from.id;
        console.log(`Processing update for userId: ${userId}`);
        await setMenuButton(userId); // Wait for menu button to be set for this user
      }
    }
  } catch (e) {
    console.error(`Failed to get updates: ${e.message}`);
  }
};

// Poll for updates every 10 seconds
const intervalId = setInterval(getUserId, 10000);

// Handle script termination
process.on('SIGINT', () => {
  clearInterval(intervalId);
  // Removed rl.close() since readline interface is not used
  process.exit(0);
});
