const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User, TutoringSession } = require('../entities');

const router = express.Router();

// Fetch Tutor Profile Data
router.get('/profileData', authenticateJWT, async (req, res) => {
  try {
    const tutor = await User.findByPk(req.user.id, {
      attributes: ['username', 'email']
    });

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json(tutor);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Fetch Tutor's Upcoming Sessions
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const sessions = await TutoringSession.findAll({
      where: { tutorId: req.user.id },
      attributes: ['id', 'subject', 'sessionDate']
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Tutor Can Create a New Session
router.post('/sessions', authenticateJWT, async (req, res) => {
  try {
    const { studentId, subject, sessionDate } = req.body;

    const session = await TutoringSession.create({
      tutorId: req.user.id,
      studentId,
      subject,
      sessionDate
    });

    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Tutor Can Update a Session
router.put('/sessions/:id', authenticateJWT, async (req, res) => {
  try {
    const { subject, sessionDate } = req.body;

    const session = await TutoringSession.findByPk(req.params.id);
    if (!session || session.tutorId !== req.user.id) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    await session.update({ subject, sessionDate });

    res.json({ message: 'Session updated successfully', session });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Tutor Can Delete a Session
router.delete('/sessions/:id', authenticateJWT, async (req, res) => {
  try {
    const session = await TutoringSession.findByPk(req.params.id);
    if (!session || session.tutorId !== req.user.id) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    await session.destroy();

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected Tutor Profile Route
router.get('/tutorprofile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorprofile.html'));
});

// Protected Tutor Schedule Route
router.get('/tutorschedule', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorschedule.html'));
});


module.exports = router;
