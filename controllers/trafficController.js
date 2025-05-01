import TrafficLog from '../models/TrafficLog.js';

// Get daily traffic count
export const getTrafficByDate = async (req, res) => {
  try {
    const data = await TrafficLog.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch traffic by date' });
  }
};

// Get traffic by country
export const getTrafficByCountry = async (req, res) => {
  try {
    const data = await TrafficLog.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country stats' });
  }
};
