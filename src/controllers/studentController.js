const { User } = require('../entities');
const bcrypt = require('bcrypt');

const studentController = {
    async getProfile(req, res) {
        try {
            const student = await User.findByPk(req.user.id, {
                attributes: ["id", "username", "email"]
            });

            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }

            return res.status(200).json({ profile: student });
        } catch (error) {
            console.error("Get Profile Error:", error);
            return res.status(500).json({ error: "Server error. Please try again." });
        }
    },

    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;

            if (!username || !email) {
                return res.status(400).json({ error: "Username and email are required" });
            }

            const student = await User.findByPk(req.user.id);
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }

            // Check if email is already taken by another user
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists && emailExists.id !== student.id) {
                return res.status(409).json({ error: "Email is already in use" });
            }

            student.username = username;
            student.email = email;
            await student.save();

            return res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.error("Update Profile Error:", error);
            return res.status(500).json({ error: "Server error. Please try again." });
        }
    },

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: "Both current and new passwords are required" });
            }

            const student = await User.findByPk(req.user.id);
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }

            // Check if current password is correct
            const isMatch = await bcrypt.compare(currentPassword, student.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect current password" });
            }

            // Hash and update the new password
            student.password = await bcrypt.hash(newPassword, 10);
            await student.save();

            return res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error("Change Password Error:", error);
            return res.status(500).json({ error: "Server error. Please try again." });
        }
    }
};

module.exports = studentController;
