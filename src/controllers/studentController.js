'use strict';

const { User, Match, UserProfile } = require('../entities');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { JoinRequest, TutoringSession } = require('../entities');

const studentController = {
  // GET Student Profile
  async getProfile(req, res) {
    try {
      const student = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'profilePic'],
        include: {
          model: require('../entities/UserProfile'),
          as: 'profile',
          attributes: ['bio', 'subjects', 'availability', 'learningstyle']
        }
      });
  
      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }
  
      //Handle profilePic (full URL or filename)
      const supabaseStorageURL = "https://mdnnxwpxypxgwhfkzgok.supabase.co/storage/v1/object/public/profile-pictures/";
      const profilePicUrl = student.profilePic
        ? (student.profilePic.startsWith('http') 
            ? student.profilePic 
            : `${supabaseStorageURL}${student.profilePic}`)
        : null;
  
      // Debugging logs
      console.log("student.profilePic in DB:", student.profilePic);
      console.log("Resolved profilePicUrl:", profilePicUrl);
  
      // Send the response
      res.status(200).json({
        status: 'success',
        profile: {
          username: student.username,
          email: student.email,
          profilePic: profilePicUrl,  // Use the resolved URL here
          bio: student.profile?.bio || null,
          subjects: student.profile?.subjects || "",
          availability: student.profile?.availability || "",
          learningstyle: student.profile?.learningstyle || ""
        }
      });
  
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
// studentController.js
async getJoinRequestDetails(req, res) {
  try {
    const requestId = req.params.id;

    const request = await JoinRequest.findByPk(requestId, {
      include: [
        { model: User, as: 'requestingStudent', include: [{ model: UserProfile, as: 'profile' }] },
        { model: TutoringSession, as: 'requestedSession' }
      ]
    });

    if (!request) return res.status(404).json({ status: 'error', message: 'Join request not found' });

    const student = request.requestingStudent;
    const profilePicUrl = student.profilePic || '/assets/images/default.jpg';

    res.status(200).json({
      status: 'success',
      data: {
        requestId: request.id,
        sessionSubject: request.requestedSession.subject,
        student: {
          username: student.username,
          email: student.email,
          profilePic: profilePicUrl,
          bio: student.profile?.bio,
          subjects: student.profile?.subjects,
          availability: student.profile?.availability,
          learningstyle: student.profile?.learningstyle
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
},

async getSessionRequests(req, res) {
  try {
    const studentId = req.user.id;

    const requests = await JoinRequest.findAll({
      where: { tutorid: studentId, status: 'pending' },
      include: [
        {
          model: User,
          as: 'requestingStudent',
          attributes: ['id', 'username', 'profilePic'],
          include: [{ model: UserProfile, as: 'profile', attributes: ['bio', 'subjects', 'learningstyle'] }]
        },
        {
          model: TutoringSession,
          as: 'requestedSession',
          attributes: ['subject', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedRequests = requests.map(req => ({
      id: req.id,
      student: {
        id: req.requestingStudent.id,
        username: req.requestingStudent.username,
        profilePic: req.requestingStudent.profilePic || '/assets/images/white.jpeg',
        bio: req.requestingStudent.profile?.bio || '',
        subjects: req.requestingStudent.profile?.subjects || '',
        learningstyle: req.requestingStudent.profile?.learningstyle || ''
      },
      session: {
        subject: req.requestedSession.subject,
        description: req.requestedSession.description
      }
    }));

    res.status(200).json({ status: 'success', requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching session requests:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
},
  // UPDATE Student Profile
  async updateProfile(req, res) {
    try {
      const { username, email, bio, subjects, availability } = req.body;
      const file = req.file;

      if (!username || !email) {
        return res.status(400).json({ status: 'error', message: 'Username and email required' });
      }

      const student = await User.findByPk(req.user.id);
      if (!student)
        return res.status(404).json({ status: 'error', message: 'Student not found' });

      const emailExists = await User.findOne({ where: { email } });
      if (emailExists && emailExists.id !== student.id) {
        return res.status(409).json({ status: 'error', message: 'Email already in use' });
      }

      // Upload profile image to Supabase if provided
      if (file) {
        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const filePath = `avatars/${Date.now()}-${file.originalname}`;

        const uploadRes = await fetch(`https://mdnnxwpxypxgwhfkzgok.supabase.co/storage/v1/object/profile-pictures/${filePath}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': file.mimetype,
            'x-upsert': 'true'
          },
          body: file.buffer
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          console.error('Upload failed:', errorText);
          return res.status(500).json({ status: 'error', message: 'Image upload failed' });
        }

        const imageUrl = `https://mdnnxwpxypxgwhfkzgok.supabase.co/storage/v1/object/public/profile-pictures/${filePath}`;
        student.profilePic = imageUrl; // Save full URL like tutors
      }

      student.username = username;
      student.email = email;
      await student.save();

      // Create or update profile info
      const [profile, created] = await UserProfile.findOrCreate({
        where: { userId: student.id },
        defaults: { bio, subjects, availability }
      });

      if (!created) {
        if (bio !== undefined) profile.bio = bio;
        if (subjects !== undefined) profile.subjects = subjects;
        if (availability !== undefined) profile.availability = availability;
        await profile.save();
      }

      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          username: student.username,
          email: student.email,
          profilePic: student.profilePic,
          bio: profile.bio,
          subjects: profile.subjects,
          availability: profile.availability
        }
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ status: 'error', message: error.message });
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
