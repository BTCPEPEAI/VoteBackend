import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchLivePriceFromDextools = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const priceText = $('span.price').first().text().replace('$', '').trim();

    const chartEmbed = $('iframe[src*="embed"]').attr('src') || null;

    return {
      price: priceText || null,
      chartEmbed,
    };
  } catch (error) {
    console.error('Error fetching Dextools data:', error.message);
    return { price: null, chartEmbed: null };
  }
};
