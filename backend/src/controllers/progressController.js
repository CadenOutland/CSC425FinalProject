const ProgressEvent = require('../models/ProgressEvent');

async function getOverview(req, res) {
  try {
    const totalEvents = await ProgressEvent.countDocuments().exec();
    const overview = {
      totalEvents,
      totalPoints: 450, // you can compute real totals here later
      level: 5,
      experiencePoints: 1250,
      nextLevelXP: 1500,
      completedGoals: 8,
      completedChallenges: 15,
      currentStreak: 7,
      longestStreak: 12
    };
    return res.json(overview);
  } catch (err) {
    console.error('getOverview error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getStats(req, res) {
  try {
    const stats = { weeklyProgress: [ /* sample data */ ] };
    return res.json(stats);
  } catch (err) {
    console.error('getStats error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getOverview, getStats };
