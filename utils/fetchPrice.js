// utils/fetchPrice.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchLivePriceFromDextools = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Try multiple selectors or patterns (can be empty)
    const priceSpan = $('span.price').first().text().replace('$', '').trim();

    if (!priceSpan || priceSpan === '') {
      console.warn('⚠️ Price not found in HTML. Returning null.');
      return null;
    }

    return priceSpan;
  } catch (error) {
    console.error('Error fetching price from Dextools:', error.message);
    return null;
  }
};
