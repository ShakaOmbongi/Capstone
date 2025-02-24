document.getElementById("changePasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        alert("You must be logged in to change your password.");
        return;
    }

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    const response = await fetch("http://localhost:3000/student/changePassword", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    const result = await response.json();
    if (response.ok) {
        alert("Password changed successfully!");
    } else {
        alert(result.error || "Failed to change password.");
    }
});
