import axios from 'axios';
import cheerio from 'cheerio';

async function getWebsiteContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch the website: ${error.message}`);
  }
}

function hasDiscordWebhooks(html: string): boolean {
  // You can customize this regex pattern to match the format of Discord webhooks.
  const discordWebhookPattern = /https:\/\/discord\.com\/api\/webhooks\/\w+\/\w+/;
  return discordWebhookPattern.test(html);
}

function hasContentInBody(html: string): boolean {
  const $ = cheerio.load(html);
  const bodyContent = $('body').text().trim();
  return bodyContent.length > 0;
}

async function checkWebsite(url: string): Promise<number> {
  const html = await getWebsiteContent(url);
  let points = 0;

  if (hasDiscordWebhooks(html)) {
    points += 1;
  }

  if (!hasContentInBody(html)) {
    points += 1;
  }

  return points;
}

const websiteUrl = 'https://example.com'; // Replace with the URL you want to check
checkWebsite(websiteUrl)
  .then((points) => {
    console.log(`Website received ${points} points.`);
  })
  .catch((error) => {
    console.error(error.message);
  });
