'use strict';

const { User, Match, UserProfile } = require('../entities');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const studentController = {
  // Get the student's profile
  async getProfile(req, res) {
    try {
      const student = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'profilePic'],
        include: [{
          model: UserProfile,
          as: 'profile',
          attributes: ['bio', 'subjects', 'learningstyle', 'availability']
        }]
      });

      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }

      const profileData = {
        id: student.id,
        username: student.username,
        email: student.email,
        profilePic: student.profilePic,
        bio: student.profile?.bio || '',
        subjects: student.profile?.subjects || '',
        learningStyle: student.profile?.learningstyle || '',
        availability: student.profile?.availability || ''
      };

      return res.status(200).json({ status: 'success', message: 'Profile fetched', data: profileData });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Update the student's profile
  async updateProfile(req, res) {
    try {
      const { username, email, bio, subjects, availability, learningStyle } = req.body;
      const student = await User.findByPk(req.user.id, { include: [{ model: UserProfile, as: 'profile' }] });

      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }

      student.username = username;
      student.email = email;

      if (req.file) {
        student.profilePic = `https://your-supabase-url.com/storage/v1/object/public/profile-pictures/${req.file.filename}`;
      }

      await student.save();

      const profile = student.profile || await UserProfile.create({ userId: student.id });
      profile.bio = bio || '';
      profile.subjects = subjects || '';
      profile.availability = availability || '';
      profile.learningstyle = learningStyle || '';
      await profile.save();

      return res.status(200).json({ status: 'success', message: 'Profile updated', data: { student, profile } });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Change the student's password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const student = await User.findByPk(req.user.id);
      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }
      const isMatch = await bcrypt.compare(currentPassword, student.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Incorrect current password' });
      }
      student.password = await bcrypt.hash(newPassword, 10);
      await student.save();
      return res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get the match for the logged-in student
  async getMatch(req, res) {
    try {
      const studentId = req.user.id;
      const match = await Match.findOne({
        where: { studentId },
        order: [['created_at', 'DESC']]
      });

      if (!match) {
        return res.status(404).json({ status: 'error', message: 'No match found' });
      }

      const tutor = await User.findByPk(match.tutorId);
      if (!tutor) {
        return res.status(404).json({ status: 'error', message: 'Match found but tutor not found' });
      }

      return res.status(200).json({
        status: 'success',
        match: {
          tutorId: tutor.id,
          username: tutor.username,
          email: tutor.email,
          match_score: match.match_score,
          explanation: match.explanation,
          learning_style: match.learning_style || 'N/A',
          accepted: Boolean(match.accepted)
        }
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Accept the pending match
  async acceptMatch(req, res) {
    try {
      const studentId = req.user.id;
      const match = await Match.findOne({
        where: { studentId, accepted: false },
        order: [['created_at', 'DESC']]
      });

      if (!match) {
        return res.status(404).json({ status: 'error', message: 'No pending match found' });
      }

      match.accepted = true;
      await match.save();

      return res.status(200).json({ status: 'success', message: 'Match accepted', match });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = studentController;
