const { TutoringSession } = require('../entities');

const tutoringSessionController = {
    async createSession(req, res) {
        try {
            console.log("DEBUG: Received request to create session with data:", req.body);

            const { subject, sessionDate, tutorId } = req.body;
            const studentId = req.user?.id; // Ensure authentication

            if (!studentId) {
                console.log("DEBUG: Unauthorized - No student ID found");
                return res.status(403).json({ error: 'Unauthorized: No student ID found' });
            }

            const session = await TutoringSession.create({
                tutorId,
                studentId,
                subject,
                sessionDate
            });

            console.log("DEBUG: Session successfully created:", session.toJSON());
            return res.status(201).json({ message: 'Tutoring session created successfully', session });
        } catch (error) {
            console.error('Create session error:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getSessions(req, res) {
        try {
            const sessions = await TutoringSession.findAll();
            return res.status(200).json({ message: 'Fetched tutoring sessions', sessions });
        } catch (error) {
            console.error('Fetch sessions error:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getSessionById(req, res) {
        try {
            const session = await TutoringSession.findByPk(req.params.id);
            if (!session) return res.status(404).json({ error: 'Session not found' });

            return res.status(200).json({ message: 'Fetched session', session });
        } catch (error) {
            console.error('Fetch session error:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async updateSession(req, res) {
        try {
            const { subject, sessionDate } = req.body;
            const session = await TutoringSession.findByPk(req.params.id);

            if (!session) return res.status(404).json({ error: 'Session not found' });

            await session.update({ subject, sessionDate });

            return res.status(200).json({ message: 'Session updated successfully', session });
        } catch (error) {
            console.error('Update session error:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteSession(req, res) {
        try {
            const session = await TutoringSession.findByPk(req.params.id);
            if (!session) return res.status(404).json({ error: 'Session not found' });

            await session.destroy();
            return res.status(200).json({ message: 'Session deleted successfully' });
        } catch (error) {
            console.error('Delete session error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = tutoringSessionController;
