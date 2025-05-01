import geoip from 'geoip-lite';
import TrafficLog from '../models/TrafficLog.js';

export const trackTraffic = async (req, res, next) => {
  const ip = req.ip;
  const geo = geoip.lookup(ip) || {};
  const country = geo.country || 'Unknown';
  const page = req.originalUrl;

  try {
    await TrafficLog.create({
      ip,
      country,
      page,
      userAgent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Traffic log error:', err);
  }

  next();
};
