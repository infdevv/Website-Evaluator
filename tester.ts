import puppeteer from 'puppeteer';
import { URL } from 'url'; // Import the URL module to parse the URL

async function checkWebsite(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Check for Discord webhook in the page source
  const hasDiscordWebhook = await page.evaluate(() => {
    const webhookRegex = /https:\/\/discord\.com\/api\/webhooks\/\d+\/\w+/i;
    const pageSource = document.documentElement.innerHTML;
    return webhookRegex.test(pageSource);
  });

  // Perform additional checks here as needed

  // Extract the number of points from the URL query string
  const urlObj = new URL(url);
  const pointsQueryParam = urlObj.searchParams.get('points');
  const points = pointsQueryParam ? parseInt(pointsQueryParam) : 0;

  await browser.close();

  return {
    hasDiscordWebhook,
    points,
  };
}

const urlToCheck = process.argv[2]; // Get the URL from the command line argument

if (!urlToCheck) {
  console.error('Please provide a URL as a command line argument.');
} else {
  checkWebsite(urlToCheck)
    .then((result) => {
      console.log('Discord Webhook:', result.hasDiscordWebhook);
      console.log('Points:', result.points);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
