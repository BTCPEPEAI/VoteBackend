import axios from 'axios';
import * as cheerio from 'cheerio';

// Converts a normal URL to an embed chart link and tries to fetch live price
export const fetchLivePriceAndChart = async (url) => {
  try {
    let chartEmbed = null;
    let price = null;

    if (url.includes('geckoterminal.com')) {
      // Extract pool ID from GeckoTerminal URL
      const match = url.match(/\/pools\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        const poolId = match[1];
        chartEmbed = `https://www.geckoterminal.com/embed/pools/${poolId}`;
      }
      // Optional: You can try fetch price via GeckoTerminal API here later
    }

    else if (url.includes('dextools.io')) {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      price = $('span.price').first().text().replace('$', '').trim();
      chartEmbed = $('iframe[src*="embed"]').attr('src') || null;
    }

    return {
      price: price || null,
      chartEmbed: chartEmbed || null,
    };

  } catch (error) {
    console.error('Error fetching price/chart:', error.message);
    return { price: null, chartEmbed: null };
  }
};
