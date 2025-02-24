document.addEventListener("DOMContentLoaded", async function () {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        alert("You must be logged in to view your profile.");
        window.location.href = "/login";
        return;
    }

    async function loadProfile() {
        const response = await fetch("/student/profile/data", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("username").value = data.profile.username;
            document.getElementById("email").value = data.profile.email;
        } else {
            alert(data.error || "Failed to load profile");
        }
    }

    document.getElementById("updateProfileForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;

        const response = await fetch("/student/updateProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, email })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
        } else {
            alert(result.error || "Failed to update profile.");
        }
    });

    loadProfile();
});
