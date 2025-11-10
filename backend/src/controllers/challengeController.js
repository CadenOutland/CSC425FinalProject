const Challenge = require('../models/Challenge');
const ProgressEvent = require('../models/ProgressEvent'); // optional

async function getAllChallenges(req, res) {
  try {
    const docs = await Challenge.find().sort({ createdAt: -1 }).lean().exec();
    return res.json(docs);
  } catch (err) {
    console.error('getAllChallenges error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getChallengeById(req, res) {
  try {
    const doc = await Challenge.findById(req.params.id).lean().exec();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.json(doc);
  } catch (err) {
    console.error('getChallengeById error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function createChallenge(req, res) {
  try {
    const c = new Challenge(req.body);
    const saved = await c.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createChallenge error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateChallenge(req, res) {
  try {
    const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean().exec();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error('updateChallenge error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteChallenge(req, res) {
  try {
    await Challenge.findByIdAndDelete(req.params.id).exec();
    return res.status(204).end();
  } catch (err) {
    console.error('deleteChallenge error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function submitChallenge(req, res) {
  try {
    const doc = await ProgressEvent.create({ challengeId: req.params.id, userId: req.body.userId || null, points: req.body.points || 0, type: 'submission', completed: !!req.body.completed });
    return res.status(201).json(doc);
  } catch (err) {
    console.error('submitChallenge error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllChallenges, getChallengeById, createChallenge, updateChallenge, deleteChallenge, submitChallenge };
