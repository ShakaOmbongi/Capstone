'use strict';
const { User, UserProfile } = require('../entities');

const tutorController = {
  // GET profile with bio + profile pic + subjects + availability + learning style
  async getProfile(req, res) {
    try {
      const tutor = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'profilePic'],
        include: {
          model: require('../entities/UserProfile'),
          as: 'profile',
          attributes: ['bio', 'subjects', 'availability', 'learningstyle']
        }
      });

      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });

      res.status(200).json({
        status: 'success',
        profile: {
          username: tutor.username,
          email: tutor.email,
          profilePic: tutor.profilePic,
          bio: tutor.profile?.bio || null,
          subjects: tutor.profile?.subjects || "",
          availability: tutor.profile?.availability || "",
          learningstyle: tutor.profile?.learningstyle || ""
        }
      });
    } catch (error) {
      console.error("Get tutor profile error:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // UPDATE profile
  async updateProfile(req, res) {
    try {
      const { username, email, bio, subjects, availability } = req.body;
      const file = req.file;

      if (!username || !email) {
        return res.status(400).json({ status: 'error', message: 'Username and email required' });
      }

      const tutor = await User.findByPk(req.user.id);
      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });

      const emailExists = await User.findOne({ where: { email } });
      if (emailExists && emailExists.id !== tutor.id) {
        return res.status(409).json({ status: 'error', message: 'Email already in use' });
      }

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
        tutor.profilePic = imageUrl;
      }

      tutor.username = username;
      tutor.email = email;
      await tutor.save();

      const [profile, created] = await UserProfile.findOrCreate({
        where: { userId: tutor.id },
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
          username: tutor.username,
          email: tutor.email,
          profilePic: tutor.profilePic,
          bio: profile.bio,
          subjects: profile.subjects,
          availability: profile.availability
        }
      });
    } catch (error) {
      console.error("Tutor update profile error:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // CHANGE PASSWORD
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'Both passwords required' });
      }

      const tutor = await User.findByPk(req.user.id);
      if (!tutor) return res.status(404).json({ status: 'error', message: 'Tutor not found' });

      const isMatch = await require('bcrypt').compare(currentPassword, tutor.password);
      if (!isMatch) return res.status(401).json({ status: 'error', message: 'Incorrect current password' });

      tutor.password = await require('bcrypt').hash(newPassword, 10);
      await tutor.save();

      res.status(200).json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
      console.error("Tutor password change error:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = tutorController;
