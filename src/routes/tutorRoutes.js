'use strict';

const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User, TutoringSession } = require('../entities');
const router = express.Router();

router.get('/profileData', authenticateJWT, async (req, res) => {
  try {
    const tutor = await User.findByPk(req.user.id, {
      attributes: ['username', 'email']
    });

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.status(200).json(tutor);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const sessions = await TutoringSession.findAll({
      where: { tutorId: req.user.id },
      attributes: ['id', 'subject', 'sessionDate']
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/sessions', authenticateJWT, async (req, res) => {
  try {
    const { studentId, subject, sessionDate } = req.body;

    if (!subject || !sessionDate) {
      return res.status(400).json({ error: 'Subject and sessionDate are required' });
    }

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

router.put('/sessions/:id', authenticateJWT, async (req, res) => {
  try {
    const { subject, sessionDate } = req.body;

    const session = await TutoringSession.findByPk(req.params.id);

    if (!session || session.tutorId !== req.user.id) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    session.subject = subject || session.subject;
    session.sessionDate = sessionDate || session.sessionDate;

    await session.save();

    res.json({ message: 'Session updated successfully', session });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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

module.exports = router;
