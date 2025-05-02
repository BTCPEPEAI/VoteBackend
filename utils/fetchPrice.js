// utils/fetchPrice.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchLivePriceAndChart = async (url) => {
  try {
    let price = null;
    let chartEmbed = null;

    if (url.includes('geckoterminal.com')) {
      // GeckoTerminal URL (e.g., https://www.geckoterminal.com/solana/pools/xyz123)
      const match = url.match(/geckoterminal\.com\/[^/]+\/pools\/([^/?#]+)/);
      if (match && match[1]) {
        chartEmbed = `https://www.geckoterminal.com/embed/pools/${match[1]}`;
      }
      // GeckoTerminal doesn’t expose price directly via scraping, so we return only chartEmbed
    } else if (url.includes('dextools.io')) {
      // Dextools URL
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      price = $('span.price').first().text().replace('$', '').trim();
      chartEmbed = $('iframe[src*="embed"]').attr('src') || null;
    }

    return {
      price: price || null,
      chartEmbed: chartEmbed || null
    };
  } catch (error) {
    console.error('Error fetching price/chart data:', error.message);
    return { price: null, chartEmbed: null };
  }
};
