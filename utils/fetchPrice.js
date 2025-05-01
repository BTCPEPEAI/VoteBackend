// utils/fetchPrice.js
import axios from 'axios';
import * as cheerio from 'cheerio';


// Scrape price from Dextools URL
export const fetchLivePriceFromDextools = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // This selector is subject to change. We need to inspect the dextools page to confirm
    const priceText = $('span.price').first().text().replace('$', '').trim();

    return priceText || null;
  } catch (error) {
    console.error('Error fetching price from Dextools:', error.message);
    return null;
  }
};
